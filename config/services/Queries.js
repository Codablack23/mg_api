"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoQuery = void 0;
class MongoQuery {
    constructor(Model) {
        this.Model = Model;
    }
    createRecord(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.Model.create(data);
                return {
                    success: true
                };
            }
            catch (error) {
                return {
                    success: false,
                    error,
                };
            }
        });
    }
    findAll(condition) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.Model.find(condition);
                return {
                    success: true,
                    res
                };
            }
            catch (error) {
                return {
                    success: false,
                    error
                };
            }
        });
    }
    find(condition) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.Model.findOne(condition);
                if (res) {
                    return {
                        success: true,
                        res
                    };
                }
                return {
                    success: false,
                    error: "resource could not be found"
                };
            }
            catch (error) {
                return {
                    success: false,
                    error
                };
            }
        });
    }
    updateOne(condition, newData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.Model.updateOne(condition, newData);
                return {
                    success: true,
                };
            }
            catch (error) {
                return {
                    success: false,
                    error
                };
            }
        });
    }
    deleteRecord(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.Model.findByIdAndDelete(id);
                return {
                    success: true,
                };
            }
            catch (error) {
                return {
                    success: false,
                    error
                };
            }
        });
    }
    ;
}
exports.MongoQuery = MongoQuery;
