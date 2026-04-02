import { b64Decode, b64Encode } from "../utils/base64.js";


export function getProfileSettings() {
  const settingsArea = document.createElement('div');

  const b64settings = JSON.parse(localStorage.getItem('profileSettings')) || {
    b64Username: b64Encode('NewUser'),
    b64Bio: '',
    b64Avatar: '',
    b64Banner: ''
  };

  settingsArea.innerHTML = `<!-- Аватарка -->
      <div class="settings-section">
        <div class="settings-block">
          <div class="settings-label">ИКОНКА ПОЛЬЗОВАТЕЛЯ (URL)</div>
          <input type="text" class="settings-input" id="avatarUrl" placeholder="https://example.com/avatar.png" />
        </div>
        <div class="avatar-preview">
          <img src="${b64Decode(b64settings.b64Avatar)}" alt="Аватар" id="avatarPreviewImg" />
          <div class="fallback"></div>
        </div>
      </div>

      <!-- Баннер -->
      <div class="settings-section">
        <div class="settings-block">
          <div class="settings-label">БАННЕР ПОЛЬЗОВАТЕЛЯ (URL)</div>
          <input type="text" class="settings-input" id="bannerUrl" placeholder="https://example.com/banner.png" />
        </div>
        <div class="banner-preview">
          <img src="${b64Decode(b64settings.b64Banner)}" alt="Баннер" id="bannerPreviewImg" />
          <div class="fallback"></div>
        </div>
      </div>

      <!-- Ник -->
      <div class="settings-block">
        <div class="settings-label">НИК ПОЛЬЗОВАТЕЛЯ</div>
        <input type="text" class="settings-input" id="username" placeholder="Ваш ник" />
      </div>

      <!-- Описание -->
      <div class="settings-block">
        <div class="settings-label">ОПИСАНИЕ</div>
        <textarea class="settings-input" id="userBio" rows="3" placeholder="Расскажите о себе..."></textarea>
      </div>

      <!-- Кнопка -->
      <button class="save-btn" id="saveBtn">Сохранить изменения</button>`;

  const avatarUrlInput = settingsArea.querySelector('#avatarUrl');
  const avatarPreviewImg = settingsArea.querySelector('#avatarPreviewImg');
  const bannerUrlInput = settingsArea.querySelector('#bannerUrl');
  const bannerPreviewImg = settingsArea.querySelector('#bannerPreviewImg'); 
  const usernameInput = settingsArea.querySelector('#username');
  const userBioInput = settingsArea.querySelector('#userBio');

  avatarUrlInput.value = b64Decode(b64settings.b64Avatar);
  bannerUrlInput.value = b64Decode(b64settings.b64Banner);
  usernameInput.value = b64Decode(b64settings.b64Username);
  userBioInput.value = b64Decode(b64settings.b64Bio);



  avatarUrlInput.addEventListener('input', () => {
    const url = avatarUrlInput.value.trim();
    if (url) {
      avatarPreviewImg.src = url;
      avatarPreviewImg.classList.remove('error');
    } else {
      avatarPreviewImg.src = '';
    }
  });
    avatarPreviewImg.onerror = () => {
    avatarPreviewImg.classList.add('error');
  };

  bannerUrlInput.addEventListener('input', () => {
    const url = bannerUrlInput.value.trim();
    if (url) {
      bannerPreviewImg.src = url;
      bannerPreviewImg.classList.remove('error');
    } else {
      bannerPreviewImg.src = '';
    }
  });
  bannerPreviewImg.onerror = () => {
    bannerPreviewImg.classList.add('error');
  };



  settingsArea.querySelector('#saveBtn').addEventListener('click', () => {
    const settings = {
        b64Username: b64Encode(usernameInput.value.trim()),
        b64Bio: b64Encode(userBioInput.value.trim()),
        b64Avatar: b64Encode(avatarUrlInput.value.trim()),
        b64Banner: b64Encode(bannerUrlInput.value.trim())
      };

      localStorage.setItem('profileSettings', JSON.stringify(settings));
    });

  return settingsArea;
}


export function getGuildListSettings() {
  const settingsArea = document.createElement('div');
  settingsArea.style = "display: flex; flex-direction: row; gap: 20px;";
  settingsArea.innerHTML = `<!-- Левое поле (как список каналов) -->
      <div class="management-list">
        <div class="management-item active">
          <span>#</span>
          <span>Пример</span>
        </div>
      </div>

      <!-- Кнопки справа -->
      <div class="management-buttons">
        <button class="management-btn">Создать</button>
        <button class="management-btn">Изменить</button>
        <button class="management-btn">Удалить</button>
        <button class="management-btn">Вверх</button>
        <button class="management-btn">Вниз</button>
      </div>`;

  return settingsArea;
}