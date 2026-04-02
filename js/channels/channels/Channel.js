export class Channel {
    _rootCategory;
    _id;
    _parent = null;
    _info;

    constructor(rootCategory, id, parent, channelInfo) {
        this._rootCategory = rootCategory;
        this._id = id;
        this._parent = parent;
        this._info = channelInfo;
    }

    getParent() {return this._parent;}

    getRootCategory() {return this._rootCategory;}

    getId() {return this._id;}

    getType() {throw new Error('getType must be implemented by subclass');}
    
    getInfo() {return this._info;}
    
    setInfo(info) {this._info = info;}
}