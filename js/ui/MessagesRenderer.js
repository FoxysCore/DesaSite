import { ContentBlockType } from "../messages/contentBlocks/ContentBlockType.js";
import { UserMessage } from "../messages/messages/UserMessage.js";
import { TextContentBlock } from "../messages/contentBlocks/TextContentBlock.js";

export class MessagesRenderer {
    #renderer;
    #messagesArea;
    #messageInputContainer;

    #olderObserver = null;
    #newerObserver = null;

    #olderCanUpdate = true;
    #newerCanUpdate = true;

    constructor(renderer) {
        this.#renderer = renderer;
        this.#messagesArea = document.getElementById("messagesArea");
        this.#messageInputContainer = document.getElementById("messageInputContainer");

        const textArea = this.#messageInputContainer.querySelector("textarea");
        const sendBtn = this.#messageInputContainer.querySelector(".send-btn");

        textArea.addEventListener("keydown", (event) => {
            if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                sendBtn.click();
            }
        });

        sendBtn.addEventListener("click", () => {
            const content = textArea.value.trim();
            const channel = this.#renderer.getChannelsRenderer().getSelectedChannel();
            const user = channel.getRootCategory().getGuild().getUserManager().getCurrentUser();

            const message = new UserMessage(0, user.getId(), channel.getId());

            if (content) {
                message.addContentBlock(new TextContentBlock(content));
            }

            if (message.getContent().length === 0) {
                return;
            }

            channel.sendMessage(message);
            textArea.value = "";
        });

        this.#olderObserver = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    if (!this.#olderCanUpdate) {return;}
                    this.#olderCanUpdate = false;
                    this.#loadOlderMessages();
                    requestAnimationFrame(() => {this.#olderCanUpdate = true;});
                    return;
                }
            }
        }, {
            root: this.#messagesArea,
            threshold: 1
        });

        this.#newerObserver = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    if (!this.#newerCanUpdate) {return;}
                    this.#newerCanUpdate = false;
                    this.#loadNewerMessages();
                    requestAnimationFrame(() => {this.#newerCanUpdate = true;});
                    return;
                }
            }
        }, {
            root: this.#messagesArea,
            threshold: 1
        });
    }


    clear() {
        this.#messagesArea.innerHTML = "";
    }
    
    /**
     * Полностью перерисовывает чат при смене канала (очищает и загружает последние сообщения).
     * Автоматически прокручивает в самый низ (к самым новым сообщениям).
     */
    renderChannelMessages(channel) {
        this.#messagesArea.innerHTML = "";
        this.#loadOlderMessages(true); // true = initial render
    }

    /**
     * Добавляет новое ("живое") сообщение в чат.
     * Сообщение отрисовывается ТОЛЬКО если пользователь уже находится внизу списка
     * (с небольшой погрешностью). После добавления автоматически прокручивается вниз.
     * 
     * Используй этот метод при получении нового сообщения из канала (включая свои).
     */
    addNewMessage(message, channel) {
        if (!this.#isScrolledToBottom()) {
            return;
        }
        if (channel != this.#renderer.getChannelsRenderer().getSelectedChannel()) {
            return;
        }
        const messageDiv = this.#createMessageDiv(message, channel, 0);

        this.#messagesArea.prepend(messageDiv);

        // Поддерживаем лимит в 40 сообщений (удаляем самые старые)
        while (this.#messagesArea.childElementCount > 40) {
            this.#messagesArea.lastChild.remove();
        }

        this.#scrollToBottom();
        this.#updateRenderedRange();
        this.#setupObservers();
    }

    #isScrolledToBottom() {
        const el = this.#messagesArea;
        console.log(el.scrollTop);
        return el.scrollTop >= -5;
    }

    #scrollToBottom() {
        const el = this.#messagesArea;
        // Принудительное чтение scrollTop — оставлено как минимальный "костыль" для стабильности layout в flex column-reverse
        void el.scrollTop;

        requestAnimationFrame(() => {
            el.scrollTop = el.scrollHeight;
        });
    }

    #loadOlderMessages(isInitial = false) {
        const channel = this.#renderer.getChannelsRenderer().getSelectedChannel();
        const firstMessage = this.#messagesArea.lastChild; // самый старый (визуально вверху)
        let timestamp = firstMessage ? parseInt(firstMessage.dataset.timestamp) : 0;

        const scrollTopBefore = this.#messagesArea.scrollTop;

        for (let i = 0; i < 20; i++) {
            const message = channel.getMessageBefore(timestamp);
            if (message === null) break;
            timestamp = message.getTimestamp();
            this.#messagesArea.appendChild(this.#createMessageDiv(message, channel, 0));
        }

        // Если ничего не добавили — выходим
        if (timestamp === 0 || (firstMessage && timestamp === parseInt(firstMessage.dataset.timestamp))) {
            return;
        }

        // Принудительное чтение для стабильности layout
        void this.#messagesArea.scrollTop;

        requestAnimationFrame(() => {
            // Восстанавливаем позицию скролла (смещение из-за добавления старых сообщений сверху)
            this.#messagesArea.scrollTop = scrollTopBefore;

            const scrollAdjust = this.#messagesArea.scrollHeight + scrollTopBefore;

            // Обрезаем до 40 сообщений (удаляем самые новые, если нужно)
            while (this.#messagesArea.childElementCount > 40) {
                this.#messagesArea.firstChild.remove();
            }

            // Ещё одно принудительное чтение
            void this.#messagesArea.scrollTop;

            requestAnimationFrame(() => {
                // Финальная корректировка позиции после обрезки
                this.#messagesArea.scrollTop = scrollAdjust - this.#messagesArea.scrollHeight;

                if (isInitial) {
                    // При первом рендере канала всегда прокручиваем к самым новым
                    this.#scrollToBottom();
                }

                this.#updateRenderedRange();
                this.#setupObservers();
            });
        });
    }

    #loadNewerMessages() {
        const channel = this.#renderer.getChannelsRenderer().getSelectedChannel();
        const firstMessage = this.#messagesArea.firstChild; // самый новый (визуально внизу)
        let timestamp = firstMessage ? parseInt(firstMessage.dataset.timestamp) : 0;

        const scrollAdjustBefore = this.#messagesArea.scrollHeight + this.#messagesArea.scrollTop;

        for (let i = 0; i < 20; i++) {
            const message = channel.getMessageAfter(timestamp);
            if (message === null) break;
            timestamp = message.getTimestamp();
            this.#messagesArea.prepend(this.#createMessageDiv(message, channel, 0));
        }

        // Если ничего не добавили — выходим
        if (timestamp === 0 || (firstMessage && timestamp === parseInt(firstMessage.dataset.timestamp))) {
            return;
        }

        // Принудительное чтение для стабильности layout
        void this.#messagesArea.scrollTop;

        requestAnimationFrame(() => {
            // Корректируем позицию после добавления новых сообщений снизу
            this.#messagesArea.scrollTop = scrollAdjustBefore - this.#messagesArea.scrollHeight;

            const scrollTopAfterAdd = this.#messagesArea.scrollTop;

            // Обрезаем до 40 сообщений (удаляем самые старые)
            while (this.#messagesArea.childElementCount > 40) {
                this.#messagesArea.lastChild.remove();
            }

            // Принудительное чтение
            void this.#messagesArea.scrollTop;

            requestAnimationFrame(() => {
                // Восстанавливаем позицию после обрезки
                this.#messagesArea.scrollTop = scrollTopAfterAdd;

                this.#updateRenderedRange();
                this.#setupObservers();
            });
        });
    }

    #updateRenderedRange() {
        const channel = this.#renderer.getChannelsRenderer().getSelectedChannel();

        const oldestTs = this.#messagesArea.lastChild
            ? parseInt(this.#messagesArea.lastChild.dataset.timestamp)
            : 0;
        const newestTs = this.#messagesArea.firstChild
            ? parseInt(this.#messagesArea.firstChild.dataset.timestamp)
            : 0;

        channel.setRendered(oldestTs, newestTs);
    }

    #setupObservers() {
        this.#olderObserver.disconnect();
        this.#newerObserver.disconnect();

        const count = this.#messagesArea.childElementCount;
        if (count === 0) return;

        // Sentinel для старых сообщений (визуально сверху — последние 5 элементов DOM)
        if (count >= 5) {
            this.#olderObserver.observe(this.#messagesArea.childNodes[count - 5]);
        }

        // Sentinel для новых сообщений (визуально снизу — первые 5 элементов DOM)
        if (count >= 5) {
            this.#newerObserver.observe(this.#messagesArea.childNodes[4]);
        }
    }

    #createMessageDiv(message, channel, setId) {
        const messageDiv = document.createElement("div");
        messageDiv.className = "message";
        messageDiv.dataset.timestamp = message.getTimestamp();
        messageDiv.dataset.setId = setId;

        const user = channel.getRootCategory().getGuild().getUserManager().getUser(message.getSenderId());

        const avatar = document.createElement("div");
        avatar.className = "server-icon";
        avatar.appendChild(user.getInfo().getIconElement());
        messageDiv.appendChild(avatar);

        avatar.addEventListener("click", (event) => {
            this.#renderer.getRightMenuRenderer().openUserInfo(user);
            event.stopPropagation();
        });

        const displayContent = document.createElement("div");
        displayContent.className = "message-content";
        messageDiv.appendChild(displayContent);

        const messageAuthor = document.createElement("div");
        messageAuthor.className = "message-author";
        messageAuthor.appendChild(user.getInfo().getDisplayNameElement());
        displayContent.appendChild(messageAuthor);

        for (const block of message.getContent()) {
            displayContent.appendChild(this.#createBlockDiv(block));
        }

        return messageDiv;
    }

    #createBlockDiv(contentBlock) {
        const blockDiv = document.createElement("div");
        blockDiv.className = `content-block ${contentBlock.getType()}`;

        switch (contentBlock.getType()) {
            case ContentBlockType.TEXT:
                const textBlock = document.createElement("p");
                textBlock.textContent = contentBlock.getText();
                blockDiv.appendChild(textBlock);
                break;
            // Здесь можно расширять другими типами блоков
        }

        return blockDiv;
    }
}