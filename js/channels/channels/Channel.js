import { ChannelInfo } from "../ChannelInfo.js";

export class Channel {
    _rootCategory;
    _id;
    _parent = null;
    _info;

    constructor(rootCategory, id, parent) {
        this._rootCategory = rootCategory;
        this._id = id;
        this._parent = parent;
        this._info = new ChannelInfo();
    }

    getParent() {return this._parent;}

    getRootCategory() {return this._rootCategory;}

    getId() {return this._id;}

    getType() {throw new Error('getType must be implemented by subclass');}
    
    getInfo() {return this._info;}
}