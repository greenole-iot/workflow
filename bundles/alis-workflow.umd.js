(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@alis/ng-base'), require('@angular/core'), require('moment'), require('rxjs'), require('rxjs/operators'), require('@angular/common/http')) :
    typeof define === 'function' && define.amd ? define('@alis/workflow', ['exports', '@alis/ng-base', '@angular/core', 'moment', 'rxjs', 'rxjs/operators', '@angular/common/http'], factory) :
    (global = global || self, factory((global.alis = global.alis || {}, global.alis.workflow = {}), global.i1, global.ng.core, global.moment, global.rxjs, global.rxjs.operators, global.ng.common.http));
}(this, (function (exports, i1, i0, moment, rxjs, operators, i2) { 'use strict';

    var ExecutionService = /** @class */ (function () {
        function ExecutionService(stateService, trackingService, http, trackingWebsocketService, eventService, eventWebsocketService) {
            this.stateService = stateService;
            this.trackingService = trackingService;
            this.http = http;
            this.trackingWebsocketService = trackingWebsocketService;
            this.eventService = eventService;
            this.eventWebsocketService = eventWebsocketService;
        }
        ExecutionService.prototype.getYieldResult = function (domainId, executionId, yieldResultId) {
            var url = i1.PropertiesService.properties.fileServiceUrl + "/execution/yieldResult/" + domainId + "/" + executionId + "/" + yieldResultId;
            return this.http.get(url);
        };
        ExecutionService.prototype.getYieldResults = function (domainId, executionId) {
            var url = i1.PropertiesService.properties.fileServiceUrl + "/execution/yieldResult/" + domainId + "/" + executionId;
            return this.http.get(url);
        };
        ExecutionService.prototype.getExecutionEventsByWs = function (domainId, processId, executionId, filter) {
            var _this = this;
            return this.eventWebsocketService.connect(filter).pipe(operators.map(function (event) {
                if (event != null && event.domainId === domainId && event.processId === processId && event.executionId === executionId) {
                    return _this.processAurionEvent(event);
                }
            })).pipe(operators.retryWhen(function (errors) { return errors.pipe(operators.delay(1000)); }));
        };
        ExecutionService.prototype.getExecutionTracesByWs = function (domainId, processId, executionId, filter) {
            var _this = this;
            return this.trackingWebsocketService.connect(filter).pipe(operators.map(function (trace) {
                var execution = trace;
                if (execution != null && execution.domainId === domainId && execution.processId === processId && execution.objectId === executionId) {
                    return _this.processAurionTrace(execution);
                }
            })).pipe(operators.retryWhen(function (errors) { return errors.pipe(operators.delay(1000)); }));
        };
        ExecutionService.prototype.getExecutionsByWs = function (domainId, processId, filter) {
            var _this = this;
            return this.trackingWebsocketService.connect(filter).pipe(operators.map(function (trace) {
                var execution = trace;
                if (execution != null && execution.domainId === domainId && execution.processId === processId) {
                    return _this.processAurionTrace(execution);
                }
            })).pipe(operators.retryWhen(function (errors) { return errors.pipe(operators.delay(1000)); }));
        };
        ExecutionService.prototype.getExecutionTraces = function (domainId, executionId, startTimestamp) {
            var _this = this;
            return this.trackingService.get(domainId, 'execution', executionId, startTimestamp).pipe(operators.map(function (traces) {
                return traces.map(function (item) { return _this.processAurionTrace(item); });
            }));
        };
        ExecutionService.prototype.getExecutionTracesPoll = function (domainId, executionId, startTimestamp) {
            var _this = this;
            return this.trackingService.get(domainId, 'execution', executionId, startTimestamp).pipe(operators.map(function (traces) {
                return traces.map(function (item) { return _this.processAurionTrace(item); });
            })).pipe(operators.delay(15000)).pipe(operators.repeat());
        };
        ExecutionService.prototype.getExecutions = function (domainId, processId) {
            var _this = this;
            return this.stateService.searchExecutionsByProcess(domainId, 'execution', processId).pipe(operators.map(function (traces) {
                return traces.map(function (item) { return _this.processAurionTrace(item); });
            }));
        };
        ExecutionService.prototype.getExecutionsPoll = function (domainId, processId) {
            var _this = this;
            return this.stateService.searchExecutionsByProcess(domainId, 'execution', processId).pipe(operators.map(function (traces) {
                return traces.map(function (item) { return _this.processAurionTrace(item); });
            })).pipe(operators.delay(30000)).pipe(operators.repeat());
        };
        ExecutionService.prototype.closeWebsocket = function () {
            if (i1.PropertiesService.properties.trackingwebsocket) {
                this.trackingWebsocketService.disconnect();
            }
        };
        ExecutionService.prototype.getLatestEnded = function (processes) {
            var _this = this;
            return rxjs.forkJoin(processes.map(function (process) { return _this.getLastExecution(process.domainId, process.objectId); }));
        };
        ExecutionService.prototype.getLastExecution = function (domainId, id) {
            var _this = this;
            return this.stateService.searchExecutionsByProcess(domainId, 'execution', id).pipe(operators.map(function (states) {
                if (states == null || states.length === 0) {
                    return null;
                }
                return _this.processAurionTrace(states[0]);
            }));
        };
        ExecutionService.prototype.get = function (domainId, id) {
            var _this = this;
            return this.stateService.get(domainId, 'execution', id).pipe(operators.map(function (state) {
                if (state == null) {
                    return null;
                }
                return _this.processAurionTrace(state);
            }));
        };
        ExecutionService.prototype.getEvents = function (domainId, executionId, startTimestamp) {
            var _this = this;
            return this.eventService.getEventsBySubject(domainId, 'execution', startTimestamp, "executionId.eq:" + executionId).pipe(operators.map(function (events) {
                return events.map(function (event) { return _this.processAurionEvent(event); });
            }));
        };
        ExecutionService.prototype.getEventsPoll = function (domainId, executionId, startTimestamp) {
            var _this = this;
            return this.eventService.getEventsBySubject(domainId, 'execution', startTimestamp, "executionId.eq:" + executionId).pipe(operators.map(function (events) {
                return events.map(function (event) { return _this.processAurionEvent(event); });
            })).pipe(operators.delay(1000)).pipe(operators.repeat());
            ;
        };
        ExecutionService.prototype.processAurionTrace = function (trace) {
            var execution = trace;
            execution.timestampStartPretty = trace.startedAt ? moment(trace.startedAt).format('DD/MM/YYYY HH:mm:ss') : undefined;
            execution.timestampFinalPretty = trace.finishedAt ? moment(trace.finishedAt).format('DD/MM/YYYY HH:mm:ss') : undefined;
            execution.timeEllapsedPretty = trace.executionTime ? (trace.executionTime / 1000) + 's' : null;
            execution.timestampPretty = trace.timestamp ? moment(trace.timestamp).format('DD/MM/YYYY HH:mm:ss') : undefined;
            return execution;
        };
        ExecutionService.prototype.processAurionEvent = function (event) {
            var executionEvent = event;
            executionEvent.timestampPretty = event.timestamp ? moment(event.timestamp).format('DD/MM/YYYY HH:mm:ss') : undefined;
            return executionEvent;
        };
        return ExecutionService;
    }());
    ExecutionService.ɵfac = function ExecutionService_Factory(t) { return new (t || ExecutionService)(i0.ɵɵinject(i1.StateService), i0.ɵɵinject(i1.TrackingService), i0.ɵɵinject(i2.HttpClient), i0.ɵɵinject(i1.TrackingWebsocketService), i0.ɵɵinject(i1.EventService), i0.ɵɵinject(i1.EventWebsocketService)); };
    ExecutionService.ɵprov = i0.ɵɵdefineInjectable({ token: ExecutionService, factory: ExecutionService.ɵfac, providedIn: 'root' });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(ExecutionService, [{
                type: i0.Injectable,
                args: [{
                        providedIn: 'root'
                    }]
            }], function () { return [{ type: i1.StateService }, { type: i1.TrackingService }, { type: i2.HttpClient }, { type: i1.TrackingWebsocketService }, { type: i1.EventService }, { type: i1.EventWebsocketService }]; }, null);
    })();

    var Event = /** @class */ (function () {
        function Event() {
        }
        return Event;
    }());

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (Object.prototype.hasOwnProperty.call(b, p))
                    d[p] = b[p]; };
        return extendStatics(d, b);
    };
    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign = function () {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s)
                    if (Object.prototype.hasOwnProperty.call(s, p))
                        t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    function __rest(s, e) {
        var t = {};
        for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
                t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }
    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if (d = decorators[i])
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }
    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); };
    }
    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
            return Reflect.metadata(metadataKey, metadataValue);
    }
    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try {
                step(generator.next(value));
            }
            catch (e) {
                reject(e);
            } }
            function rejected(value) { try {
                step(generator["throw"](value));
            }
            catch (e) {
                reject(e);
            } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }
    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function () { if (t[0] & 1)
                throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f)
                throw new TypeError("Generator is already executing.");
            while (_)
                try {
                    if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                        return t;
                    if (y = 0, t)
                        op = [op[0] & 2, t.value];
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op;
                            break;
                        case 4:
                            _.label++;
                            return { value: op[1], done: false };
                        case 5:
                            _.label++;
                            y = op[1];
                            op = [0];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                                _ = 0;
                                continue;
                            }
                            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                                _.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1];
                                t = op;
                                break;
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2];
                                _.ops.push(op);
                                break;
                            }
                            if (t[2])
                                _.ops.pop();
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                }
                catch (e) {
                    op = [6, e];
                    y = 0;
                }
                finally {
                    f = t = 0;
                }
            if (op[0] & 5)
                throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
        }
    }
    var __createBinding = Object.create ? (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function () { return m[k]; } });
    }) : (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        o[k2] = m[k];
    });
    function __exportStar(m, o) {
        for (var p in m)
            if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p))
                __createBinding(o, m, p);
    }
    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m)
            return m.call(o);
        if (o && typeof o.length === "number")
            return {
                next: function () {
                    if (o && i >= o.length)
                        o = void 0;
                    return { value: o && o[i++], done: !o };
                }
            };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }
    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m)
            return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                ar.push(r.value);
        }
        catch (error) {
            e = { error: error };
        }
        finally {
            try {
                if (r && !r.done && (m = i["return"]))
                    m.call(i);
            }
            finally {
                if (e)
                    throw e.error;
            }
        }
        return ar;
    }
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }
    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++)
            s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }
    ;
    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }
    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n])
            i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try {
            step(g[n](v));
        }
        catch (e) {
            settle(q[0][3], e);
        } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length)
            resume(q[0][0], q[0][1]); }
    }
    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }
    function __asyncValues(o) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function (v) { resolve({ value: v, done: d }); }, reject); }
    }
    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        }
        else {
            cooked.raw = raw;
        }
        return cooked;
    }
    ;
    var __setModuleDefault = Object.create ? (function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function (o, v) {
        o["default"] = v;
    };
    function __importStar(mod) {
        if (mod && mod.__esModule)
            return mod;
        var result = {};
        if (mod != null)
            for (var k in mod)
                if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
                    __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    }
    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }
    function __classPrivateFieldGet(receiver, privateMap) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to get private field on non-instance");
        }
        return privateMap.get(receiver);
    }
    function __classPrivateFieldSet(receiver, privateMap, value) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to set private field on non-instance");
        }
        privateMap.set(receiver, value);
        return value;
    }

    var EventDTO = /** @class */ (function (_super) {
        __extends(EventDTO, _super);
        function EventDTO() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return EventDTO;
    }(Event));

    var Execution = /** @class */ (function () {
        function Execution() {
        }
        return Execution;
    }());

    var ExecutionDTO = /** @class */ (function (_super) {
        __extends(ExecutionDTO, _super);
        function ExecutionDTO() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return ExecutionDTO;
    }(Execution));

    var Schedule = /** @class */ (function () {
        function Schedule() {
        }
        return Schedule;
    }());

    var Process = /** @class */ (function () {
        function Process() {
        }
        return Process;
    }());

    var ParametersDefinition = /** @class */ (function () {
        function ParametersDefinition() {
        }
        return ParametersDefinition;
    }());

    var EntryInput = /** @class */ (function () {
        function EntryInput() {
        }
        return EntryInput;
    }());

    var InputDefinition = /** @class */ (function () {
        function InputDefinition() {
        }
        return InputDefinition;
    }());

    var DataSource = /** @class */ (function () {
        function DataSource() {
        }
        return DataSource;
    }());

    var ProcessStep = /** @class */ (function () {
        function ProcessStep() {
        }
        return ProcessStep;
    }());

    var ProcessService = /** @class */ (function () {
        function ProcessService(trackingService, http) {
            this.trackingService = trackingService;
            this.http = http;
        }
        /*
        cadu  3:15 PM
        na doc da modelagem do workflows eu tive q adicionar na Execução 2 campos, o context e location
        context é o cliente (AES) e location é o processo
        */
        ProcessService.prototype.get = function (domainId) {
            return this.trackingService.getByType(domainId, 'process').pipe(operators.map(function (traces) {
                return traces.map(function (trace) {
                    return trace;
                });
            }));
        };
        ProcessService.prototype.getById = function (domainId, processId) {
            return this.get(domainId).pipe(operators.map(function (items) {
                return items.find(function (item) { return item.objectId == processId; });
            }));
        };
        ProcessService.prototype.save = function (process) {
            return this.trackingService.set(process);
        };
        ProcessService.prototype.execute = function (domainId, processObjectId, inputs, executionMode) {
            if (executionMode === void 0) { executionMode = "default"; }
            var url = i1.PropertiesService.properties.fileServiceUrl + "/execution/start/" + domainId + "/" + processObjectId;
            var userJSON = sessionStorage.getItem('user');
            var user = userJSON != null && userJSON != '' ? JSON.parse(userJSON) : "";
            // let inputsPostFormat = inputs.reduce((prev, cur) => { prev[cur.id] = cur.value; return prev }, {});
            return this.http.post(url, { processId: processObjectId, inputs: inputs, executionMode: executionMode }, {
                headers: {
                    'Authorization': 'Bearer ' + user.idToken
                }
            });
        };
        ProcessService.prototype.continue = function (domainId, executionId, inputs) {
            var _a;
            var url = i1.PropertiesService.properties.fileServiceUrl + "/execution/" + domainId + "/" + executionId + "/continue";
            var userJSON = sessionStorage.getItem('user');
            var parsedUserJSON = userJSON != null && userJSON != '' ? JSON.parse(userJSON) : "";
            var payload = {
                domainId: domainId,
                executionId: executionId,
                inputs: inputs,
                user: ((_a = parsedUserJSON.idTokenPayload) === null || _a === void 0 ? void 0 : _a.nickname) || "",
            };
            return this.http.post(url, payload, {
                headers: {
                    'Authorization': 'Bearer ' + parsedUserJSON.idToken
                },
                responseType: 'text'
            });
        };
        //continue overriding stageIndex
        ProcessService.prototype.continueOverridingStage = function (domainId, executionId, inputs, overrideStageIndex) {
            var url = i1.PropertiesService.properties.fileServiceUrl + "/execution/" + domainId + "/" + executionId + "/continue?overrideStageIndex=" + overrideStageIndex;
            var userJSON = sessionStorage.getItem('user');
            var parsedUserJSON = userJSON != null && userJSON != '' ? JSON.parse(userJSON) : "";
            var payload = {
                inputs: inputs
            };
            return this.http.post(url, payload, {
                headers: {
                    'Authorization': 'Bearer ' + parsedUserJSON.idToken
                },
                responseType: 'text'
            });
        };
        return ProcessService;
    }());
    ProcessService.ɵfac = function ProcessService_Factory(t) { return new (t || ProcessService)(i0.ɵɵinject(i1.TrackingService), i0.ɵɵinject(i2.HttpClient)); };
    ProcessService.ɵprov = i0.ɵɵdefineInjectable({ token: ProcessService, factory: ProcessService.ɵfac, providedIn: 'root' });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(ProcessService, [{
                type: i0.Injectable,
                args: [{
                        providedIn: 'root'
                    }]
            }], function () { return [{ type: i1.TrackingService }, { type: i2.HttpClient }]; }, null);
    })();

    var WorkflowLibModule = /** @class */ (function () {
        function WorkflowLibModule(propertiesService) {
            var _this = this;
            this.propertiesService = propertiesService;
            this.ready = false;
            this.propertiesService.readAllProperties().subscribe(function () {
                _this.ready = true;
            });
        }
        return WorkflowLibModule;
    }());
    WorkflowLibModule.ɵmod = i0.ɵɵdefineNgModule({ type: WorkflowLibModule });
    WorkflowLibModule.ɵinj = i0.ɵɵdefineInjector({ factory: function WorkflowLibModule_Factory(t) { return new (t || WorkflowLibModule)(i0.ɵɵinject(i1.PropertiesService)); }, imports: [[
                i1.NgBaseLibModule,
                i2.HttpClientModule
            ]] });
    (function () {
        (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(WorkflowLibModule, { imports: [i1.NgBaseLibModule,
                i2.HttpClientModule] });
    })();
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(WorkflowLibModule, [{
                type: i0.NgModule,
                args: [{
                        declarations: [],
                        imports: [
                            i1.NgBaseLibModule,
                            i2.HttpClientModule
                        ],
                        exports: []
                    }]
            }], function () { return [{ type: i1.PropertiesService }]; }, null);
    })();

    var FileServiceMetadata = /** @class */ (function () {
        function FileServiceMetadata() {
        }
        FileServiceMetadata.fromFile = function (domainId, file, user) {
            var fileServiceMetadata = new FileServiceMetadata();
            fileServiceMetadata.domainId = domainId;
            fileServiceMetadata.subDomainId = "users";
            fileServiceMetadata.name = file.name;
            fileServiceMetadata.type = file.name.substring(file.name.lastIndexOf(".") + 1);
            fileServiceMetadata.timestamp = Date.now();
            fileServiceMetadata.tags = null;
            fileServiceMetadata.entryType = "FILE";
            fileServiceMetadata.size = file.size;
            fileServiceMetadata.path = [
                fileServiceMetadata.domainId,
                fileServiceMetadata.subDomainId,
                user
            ];
            return fileServiceMetadata;
        };
        FileServiceMetadata.prototype.isFolder = function () {
            return "DIRECTORY" === this.entryType;
        };
        return FileServiceMetadata;
    }());

    var FileServiceMetadataService = /** @class */ (function () {
        function FileServiceMetadataService(http) {
            this.http = http;
        }
        FileServiceMetadataService.prototype.removeMetadata = function (domainId, fileObjectId, repository) {
            var url = repository || i1.PropertiesService.properties.fileServiceUrl + "/fileservice/file";
            var options = {
                headers: new i2.HttpHeaders()
                    .set("accept", "*/*"),
                params: new i2.HttpParams()
                    .set("domainId", domainId)
                    .set("id", fileObjectId)
            };
            return this.http.delete(url, options);
        };
        FileServiceMetadataService.prototype.removeFile = function (removeLink) {
            return this.http.delete(removeLink);
        };
        FileServiceMetadataService.prototype.uploadMetadata = function (newFileServiceMetadata, repository) {
            var url = repository || i1.PropertiesService.properties.fileServiceUrl + "/fileservice/file";
            var options = {
                headers: new i2.HttpHeaders()
                    .set("accept", "*/*")
                    .set("content-type", "application/json")
            };
            return this.http.post(url, newFileServiceMetadata, options);
        };
        /*
          obs: the headers received by this method, comes in this format:
          {
            <header1>: <header1 value>,
            <header2>: <header2 value>
            .
            .
            .
          }
      
          when receiving headers as HttpHeaders, built by the service consumer,
          the headers that were added goes to "lazyUpdate" field inside HttpHeaders
          instance instead "headers" field, which leads to CORS error due those mandatory
          headers are not been sent.
      
          in order to solve this, the "headers" object, demanded by HttpClient methods,
          accepts a plain JSON object. therefore, the service consumer should send
          "headers" as a plain JSON object.
        */
        FileServiceMetadataService.prototype.uploadFile = function (uploadLink, file, headers) {
            var options = {
                headers: headers
            };
            return this.http.put(uploadLink, file, options);
        };
        //TODO - verificar se existe uma forma de já buscar os metadados ordenados através do indexing;
        //o mesmo vale para processos e execuções; enquanto isso, o front ordena as listas quando necessário
        /**
         *
         * @param domainId
         * @param path
         * @param repository
         * @param query HTTP List of filters using the Aurion SearchCriteria pattern: key.operation:filterValue[,otherFilterValue]. Operations: eq/neq/sw/gt/egt/lt/elt. (ex: attribute1.eq:testValue)
         */
        FileServiceMetadataService.prototype.list = function (domainId, path, strictly, repository, query) {
            var url = repository || i1.PropertiesService.properties.fileServiceUrl + "/fileservice/list";
            var params = new i2.HttpParams()
                .set("domainId", domainId)
                .set("path", path)
                .set("locationStrictly", strictly != null ? "" + strictly : "false");
            if (query != null) {
                params = params.set('query', query);
            }
            var options = {
                headers: new i2.HttpHeaders().set("accept", "*/*"),
                params: params
            };
            return this.http.get(url, options).pipe(operators.map(function (fileServiceMetadatas) {
                return fileServiceMetadatas.sort(function (a, b) {
                    return a.creationDateTimestamp > b.creationDateTimestamp ? -1 : 1;
                });
            }));
        };
        FileServiceMetadataService.prototype.getFileDetail = function (domainId, fileId, repository) {
            var url = repository || i1.PropertiesService.properties.fileServiceUrl + "/fileservice/file";
            var options = {
                headers: new i2.HttpHeaders()
                    .set("accept", "*/*"),
                params: new i2.HttpParams()
                    .set("domainId", domainId)
                    .set("id", fileId)
            };
            return this.http.get(url, options);
        };
        FileServiceMetadataService.prototype.downloadFile = function (fileMetadata) {
            var _this = this;
            this.getFileDetail(fileMetadata.domainId, fileMetadata.objectId).subscribe(function (fileDetail) {
                if (fileDetail != null) {
                    var link = fileDetail.metadata.link ? fileDetail.metadata.link : fileDetail['link'];
                    var metadata = fileDetail['metadata'];
                    if (metadata == null) {
                        console.warn('metadata received is null');
                        return null;
                    }
                    var fileName = metadata.name;
                    _this.download(link, fileName);
                }
                else {
                    console.error("response is null", fileDetail);
                }
            }, function (error) {
                console.error(error);
            });
        };
        FileServiceMetadataService.prototype.download = function (url, fileName) {
            return __awaiter(this, void 0, void 0, function () {
                var a, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            a = document.createElement("a");
                            _a = a;
                            return [4 /*yield*/, this.toDataURL(url)];
                        case 1:
                            _a.href = _b.sent();
                            a.download = fileName;
                            document.body.appendChild(a);
                            a.click();
                            return [2 /*return*/];
                    }
                });
            });
        };
        FileServiceMetadataService.prototype.toDataURL = function (url) {
            return fetch(url).then(function (response) {
                return response.blob();
            }).then(function (blob) {
                return URL.createObjectURL(blob);
            });
        };
        FileServiceMetadataService.prototype.getBytes = function (fileId, repository) {
            return null;
        };
        return FileServiceMetadataService;
    }());
    FileServiceMetadataService.ɵfac = function FileServiceMetadataService_Factory(t) { return new (t || FileServiceMetadataService)(i0.ɵɵinject(i2.HttpClient)); };
    FileServiceMetadataService.ɵprov = i0.ɵɵdefineInjectable({ token: FileServiceMetadataService, factory: FileServiceMetadataService.ɵfac, providedIn: 'root' });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(FileServiceMetadataService, [{
                type: i0.Injectable,
                args: [{
                        providedIn: 'root'
                    }]
            }], function () { return [{ type: i2.HttpClient }]; }, null);
    })();

    var ScheduleService = /** @class */ (function () {
        function ScheduleService(http) {
            this.http = http;
        }
        // GET /schedule/{domainId}/process/{processId}
        ScheduleService.prototype.getProcessSchedules = function (domainId, processId) {
            var url = i1.PropertiesService.properties.scheduleServiceUrl + "/" + domainId + "/process/" + processId;
            return this.http.get(url);
        };
        // POST /schedule/{domainId}/{processId}
        ScheduleService.prototype.createOrUpdateSchedule = function (domainId, processId, schedule) {
            var url = i1.PropertiesService.properties.scheduleServiceUrl + "/" + domainId + "/" + processId;
            schedule.processId = schedule.processId || processId;
            return this.http.post(url, schedule, { responseType: 'text' });
        };
        // DELETE /schedule/{domainId}/{scheduleId}
        ScheduleService.prototype.deleteSchedule = function (domainId, scheduleId) {
            var url = i1.PropertiesService.properties.scheduleServiceUrl + "/" + domainId + "/" + scheduleId;
            return this.http.delete(url);
        };
        return ScheduleService;
    }());
    ScheduleService.ɵfac = function ScheduleService_Factory(t) { return new (t || ScheduleService)(i0.ɵɵinject(i2.HttpClient)); };
    ScheduleService.ɵprov = i0.ɵɵdefineInjectable({ token: ScheduleService, factory: ScheduleService.ɵfac, providedIn: 'root' });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(ScheduleService, [{
                type: i0.Injectable,
                args: [{
                        providedIn: 'root'
                    }]
            }], function () { return [{ type: i2.HttpClient }]; }, null);
    })();

    /*
     * Public API Surface of workflow
     */

    /**
     * Generated bundle index. Do not edit.
     */

    exports.DataSource = DataSource;
    exports.EntryInput = EntryInput;
    exports.Event = Event;
    exports.EventDTO = EventDTO;
    exports.Execution = Execution;
    exports.ExecutionDTO = ExecutionDTO;
    exports.ExecutionService = ExecutionService;
    exports.FileServiceMetadata = FileServiceMetadata;
    exports.FileServiceMetadataService = FileServiceMetadataService;
    exports.InputDefinition = InputDefinition;
    exports.ParametersDefinition = ParametersDefinition;
    exports.Process = Process;
    exports.ProcessService = ProcessService;
    exports.ProcessStep = ProcessStep;
    exports.Schedule = Schedule;
    exports.ScheduleService = ScheduleService;
    exports.WorkflowLibModule = WorkflowLibModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=alis-workflow.umd.js.map
