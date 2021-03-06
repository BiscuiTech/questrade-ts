"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var utils_1 = require("../../../../utils");
var routes_1 = require("../../../routes");
// + _getOrders
/** _getOrders */
exports._getOrders = function (credentials) { return function (stateFilter) {
    if (stateFilter === void 0) { stateFilter = 'All'; }
    return function (startDate) { return function (endDate) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var error_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, routes_1._axiosAccountGetApi(credentials)("/orders?" + utils_1.endpointFormatDateTool(startDate, endDate) + "stateFilter=" + stateFilter)()];
                case 1: return [2 /*return*/, (_a.sent()).orders];
                case 2:
                    error_1 = _a.sent();
                    console.error(error_1.message);
                    return [2 /*return*/, []];
                case 3: return [2 /*return*/];
            }
        });
    }); }; };
}; };
//# sourceMappingURL=_getOrders.js.map