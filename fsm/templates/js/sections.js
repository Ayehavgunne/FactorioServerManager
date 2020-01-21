var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import WebSocket from "./websocket";
import { HistoryBar, Input } from "./components";
import { is_object, print } from "./util";

var Status = function (_Component) {
    _inherits(Status, _Component);

    function Status(props) {
        _classCallCheck(this, Status);

        var _this = _possibleConstructorReturn(this, (Status.__proto__ || Object.getPrototypeOf(Status)).call(this, props));

        _this.state = {
            selected_tab: "cpu",
            update_version: "",
            game_status: "",
            total_mem: "",
            total_mem_raw: "",
            version: "",
            cpu_text: "",
            mem_text: "",
            avail_mem_text: "",
            history: []
        };

        _this.get_game_version = _this.get_game_version.bind(_this);
        _this.handle_data = _this.handle_data.bind(_this);
        _this.change_chart_tab = _this.change_chart_tab.bind(_this);
        return _this;
    }

    _createClass(Status, [{
        key: "get_game_version",
        value: function get_game_version() {
            return fetch("factorio/" + this.props.selected_game + "/get_current_version").then(function (data) {
                return data.text();
            });
        }
    }, {
        key: "change_chart_tab",
        value: function change_chart_tab(e) {
            var target = e.target;
            this.setState({
                selected_tab: target.id.replace("game_", "").replace("_tab", "")
            });
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            var _this2 = this;

            this.get_game_version().then(function (data) {
                _this2.setState({
                    version: data
                });
            });
        }
    }, {
        key: "handle_data",
        value: function handle_data(data) {
            var result = JSON.parse(data);
            if (result) {
                this.setState({
                    game_status: result[0]["status"].title(),
                    total_mem: result[0]["total_mem"],
                    total_mem_raw: result[0]["total_mem_raw"],
                    cpu_text: result[0]["cpu"],
                    mem_text: result[0]["mem"],
                    avail_mem_text: result[0]["available_mem"],
                    history: result
                });
            } else {
                this.setState({
                    game_status: "Stopped",
                    total_mem_raw: "",
                    cpu_text: "",
                    mem_text: "",
                    avail_mem_text: ""
                });
            }
        }
    }, {
        key: "switch_chart",
        value: function switch_chart() {
            var _this3 = this;

            var Chart = void 0;
            var threshold = 2;
            var total_mem = this.state.total_mem_raw;
            switch (this.state.selected_tab) {
                case "cpu":
                    Chart = function Chart() {
                        return React.createElement(
                            "div",
                            { id: "game_cpu", className: "chart_box" },
                            _this3.state.history.map(function (item, i) {
                                var cpu = item.cpu;
                                if (cpu < threshold) {
                                    cpu = threshold;
                                }
                                return React.createElement(HistoryBar, { height: cpu, key: i, num: i * 2 });
                            })
                        );
                    };
                    break;
                case "mem":
                    Chart = function Chart() {
                        return React.createElement(
                            "div",
                            { id: "game_mem", className: "chart_box" },
                            _this3.state.history.map(function (item, i) {
                                var mem_percent = item.mem_raw / total_mem * 100;
                                if (mem_percent < threshold) {
                                    mem_percent = threshold;
                                }
                                return React.createElement(HistoryBar, { height: mem_percent, key: i, num: i * 2 });
                            })
                        );
                    };
                    break;
                case "available_mem":
                    Chart = function Chart() {
                        return React.createElement(
                            "div",
                            { id: "available_mem", className: "chart_box" },
                            _this3.state.history.map(function (item, i) {
                                var mem_percent = item.available_mem_raw / total_mem * 100;
                                if (mem_percent < threshold) {
                                    mem_percent = threshold;
                                }
                                return React.createElement(HistoryBar, { height: mem_percent, key: i, num: i * 2 });
                            })
                        );
                    };
            }
            return Chart;
        }
    }, {
        key: "render",
        value: function render() {
            var _state = this.state,
                selected_tab = _state.selected_tab,
                update_version = _state.update_version,
                game_status = _state.game_status,
                total_mem = _state.total_mem,
                version = _state.version,
                cpu_text = _state.cpu_text,
                mem_text = _state.mem_text,
                avail_mem_text = _state.avail_mem_text;

            var selected_game = this.props.selected_game;
            var Chart = this.switch_chart();

            return React.createElement(
                React.Fragment,
                null,
                React.createElement(
                    "div",
                    { id: "charts" },
                    React.createElement(Chart, null),
                    React.createElement(
                        "div",
                        {
                            id: "game_cpu_tab",
                            className: selected_tab === "cpu" ? "chart_tab selected_tab" : "chart_tab",
                            onClick: this.change_chart_tab },
                        "CPU ",
                        cpu_text,
                        cpu_text + "" ? "%" : ""
                    ),
                    React.createElement(
                        "div",
                        {
                            id: "game_mem_tab",
                            className: selected_tab === "mem" ? "chart_tab selected_tab" : "chart_tab",
                            onClick: this.change_chart_tab },
                        "Memory ",
                        mem_text
                    ),
                    React.createElement(
                        "div",
                        {
                            id: "available_mem_tab",
                            className: selected_tab === "available_mem" ? "chart_tab selected_tab" : "chart_tab",
                            onClick: this.change_chart_tab },
                        "Available Memory ",
                        avail_mem_text
                    )
                ),
                React.createElement(
                    "div",
                    { id: "status_buttons" },
                    React.createElement(
                        "button",
                        {
                            className: "action",
                            onClick: Status.send_command,
                            "data-url": "factorio/" + selected_game + "/start" },
                        "Start ",
                        selected_game
                    ),
                    React.createElement(
                        "button",
                        {
                            className: "action",
                            onClick: Status.send_command,
                            "data-url": "factorio/" + selected_game + "/stop" },
                        "Stop ",
                        selected_game
                    ),
                    React.createElement(
                        "button",
                        {
                            className: "action",
                            onClick: Status.send_command,
                            "data-url": "factorio/" + selected_game + "/check_for_update" },
                        "Check for Updates"
                    ),
                    update_version && React.createElement(
                        "span",
                        null,
                        "Version ",
                        update_version,
                        " is available!",
                        React.createElement(
                            "button",
                            {
                                id: "get_update",
                                "data-url": "factorio/" + selected_game + "/update?version=" + version },
                            "Update Now"
                        )
                    ),
                    React.createElement(
                        "span",
                        { className: "stats" },
                        "Current Version: ",
                        version
                    ),
                    React.createElement(
                        "span",
                        { className: "stats" },
                        "Status: ",
                        game_status
                    ),
                    React.createElement(
                        "span",
                        { className: "stats" },
                        "Total System Memory: ",
                        total_mem
                    )
                ),
                React.createElement(WebSocket, {
                    url: "ws/factorio_status?name=" + selected_game,
                    onMessage: this.handle_data,
                    onOpen: function onOpen() {
                        return fetch("start_stream/factorio");
                    }
                })
            );
        }
    }], [{
        key: "send_command",
        value: function send_command(e) {
            var target = e.target;
            fetch(target.dataset.url);
        }
    }]);

    return Status;
}(Component);

var Console = function (_Component2) {
    _inherits(Console, _Component2);

    function Console(props) {
        _classCallCheck(this, Console);

        var _this4 = _possibleConstructorReturn(this, (Console.__proto__ || Object.getPrototypeOf(Console)).call(this, props));

        _this4.state = {
            history: []
        };

        _this4.handle_data = _this4.handle_data.bind(_this4);
        return _this4;
    }

    _createClass(Console, [{
        key: "handle_data",
        value: function handle_data(data) {
            var result = JSON.parse(data);
            if (result) {
                this.setState({ history: [].concat(_toConsumableArray(this.state.history), [result]) });
            }
        }
    }, {
        key: "render",
        value: function render() {
            var history = this.state.history;

            return React.createElement(
                "div",
                { id: "console_box" },
                history.map(function (message, i) {
                    return React.createElement(
                        "div",
                        { className: "console_line", key: i },
                        message
                    );
                }),
                React.createElement(WebSocket, {
                    url: "ws/log_tail?name=" + this.props.selected_game,
                    onMessage: this.handle_data,
                    onOpen: function onOpen() {
                        return fetch("start_stream/log");
                    }
                })
            );
        }
    }]);

    return Console;
}(Component);

var col_1 = ["afk_autokick_interval", "autosave_interval", "autosave_slots", "max_players", "max_upload_in_kilobytes_per_second", "minimum_latency_in_ticks", "description", "game_password", "name", "username", "password", "token", "allow_commands"];
var col_2 = ["admins", "tags", "auto_pause", "autosave_only_on_server", "ignore_player_limit_for_returning_players", "only_admins_can_pause_the_game", "require_user_verification", "visibility"];
var enums = {
    allow_commands: [{ value: "true", text: "True" }, { value: "false", text: "False" }, { value: "admins-only", text: "Admins Only" }]
};

var json_types = function json_types(name, obj, parent_comment) {
    var value = obj[name];
    var comment = obj["_comment_" + name];
    if (parent_comment) {
        comment = parent_comment;
    }
    if (typeof value !== "undefined") {
        if (Number.isInteger(value)) {
            return {
                name: name,
                value: value,
                type: "number",
                comment: comment
            };
        } else if (typeof value === "string") {
            if (enums.hasOwnProperty(name)) {
                return {
                    name: name,
                    value: value,
                    options: enums[name],
                    type: "select",
                    comment: comment
                };
            } else {
                return {
                    name: name,
                    value: value,
                    type: "text",
                    comment: comment
                };
            }
        } else if (typeof value === "boolean") {
            return {
                name: name,
                value: value,
                type: "checkbox",
                comment: comment
            };
        } else if (Array.isArray(value)) {
            return {
                name: name,
                value: value,
                type: "list",
                comment: comment
            };
        } else if (is_object(value)) {
            var children = [];
            var c = void 0;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = Object.keys(value)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var key = _step.value;

                    if (Array.isArray(comment)) {
                        var _iteratorNormalCompletion2 = true;
                        var _didIteratorError2 = false;
                        var _iteratorError2 = undefined;

                        try {
                            for (var _iterator2 = comment[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                c = _step2.value;

                                if (c.includes(key)) {
                                    break;
                                }
                            }
                        } catch (err) {
                            _didIteratorError2 = true;
                            _iteratorError2 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                    _iterator2.return();
                                }
                            } finally {
                                if (_didIteratorError2) {
                                    throw _iteratorError2;
                                }
                            }
                        }
                    }
                    children.push(json_types(key, value, c));
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return {
                name: name,
                children: children,
                comment: comment,
                type: "parent"
            };
        }
    }
};

var Configs = function (_Component3) {
    _inherits(Configs, _Component3);

    function Configs(props) {
        _classCallCheck(this, Configs);

        var _this5 = _possibleConstructorReturn(this, (Configs.__proto__ || Object.getPrototypeOf(Configs)).call(this, props));

        _this5.state = {
            fields: {},
            values: {}
        };

        _this5.get_configs = _this5.get_configs.bind(_this5);
        _this5.send_configs = _this5.send_configs.bind(_this5);
        _this5.set_config = _this5.set_config.bind(_this5);
        return _this5;
    }

    _createClass(Configs, [{
        key: "componentWillMount",
        value: function componentWillMount() {
            this.get_configs();
        }
    }, {
        key: "get_configs",
        value: function get_configs() {
            var _this6 = this;

            fetch("factorio/" + this.props.selected_game + "/server_config").then(function (result) {
                return result.json();
            }).then(function (result) {
                var field_configs = Configs.process_configs(result);
                _this6.setState({ fields: field_configs });
            });
        }
    }, {
        key: "send_configs",
        value: function send_configs() {
            print(this.state.fields);
            print(this.state.values);
        }
    }, {
        key: "set_config",
        value: function set_config() {
            var name = void 0,
                value = void 0;
            var vals = Object.assign({}, this.state.values);
            vals[name] = value;
            this.setState({
                values: vals
            });
        }
    }, {
        key: "render",
        value: function render() {
            var fields = this.state.fields;

            return React.createElement(
                "div",
                { id: "config_sec" },
                React.createElement(
                    "div",
                    { className: "columns" },
                    fields.col_1 && React.createElement(
                        "div",
                        { className: "column" },
                        fields.col_1.map(function (field) {
                            return React.createElement(Input, _extends({
                                key: field.name
                            }, field));
                        })
                    ),
                    fields.col_2 && React.createElement(
                        "div",
                        { className: "column" },
                        fields.col_2.map(function (field) {
                            return React.createElement(Input, _extends({
                                key: field.name
                            }, field));
                        })
                    )
                ),
                React.createElement(
                    "button",
                    { id: "save_server_config", onClick: this.send_configs },
                    "Save"
                )
            );
        }
    }], [{
        key: "process_configs",
        value: function process_configs(fields) {
            var field_configs = { col_1: [], col_2: [] };
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = col_1[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var name = _step3.value;

                    if (typeof fields[name] !== "undefined") {
                        field_configs.col_1.push(json_types(name, fields));
                    }
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }

            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = col_2[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var _name = _step4.value;

                    if (typeof fields[_name] !== "undefined") {
                        field_configs.col_2.push(json_types(_name, fields));
                    }
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }

            return field_configs;
        }
    }]);

    return Configs;
}(Component);

export var section_mapper = function section_mapper(props) {
    var Section = void 0;
    switch (props.selected_section) {
        case "status":
            Section = function Section() {
                return React.createElement(Status, props);
            };
            break;
        case "console":
            Section = function Section() {
                return React.createElement(Console, props);
            };
            break;
        case "mods":
            Section = function Section() {
                return React.createElement(
                    "div",
                    null,
                    "TODO mods"
                );
            };
            break;
        case "config":
            Section = function Section() {
                return React.createElement(Configs, props);
            };
            break;
        default:
            Section = function Section() {
                return "";
            };
    }
    return Section;
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2pzeC9zZWN0aW9ucy5qc3giXSwibmFtZXMiOlsiUmVhY3QiLCJDb21wb25lbnQiLCJXZWJTb2NrZXQiLCJIaXN0b3J5QmFyIiwiSW5wdXQiLCJpc19vYmplY3QiLCJwcmludCIsIlN0YXR1cyIsInByb3BzIiwic3RhdGUiLCJzZWxlY3RlZF90YWIiLCJ1cGRhdGVfdmVyc2lvbiIsImdhbWVfc3RhdHVzIiwidG90YWxfbWVtIiwidG90YWxfbWVtX3JhdyIsInZlcnNpb24iLCJjcHVfdGV4dCIsIm1lbV90ZXh0IiwiYXZhaWxfbWVtX3RleHQiLCJoaXN0b3J5IiwiZ2V0X2dhbWVfdmVyc2lvbiIsImJpbmQiLCJoYW5kbGVfZGF0YSIsImNoYW5nZV9jaGFydF90YWIiLCJmZXRjaCIsInNlbGVjdGVkX2dhbWUiLCJ0aGVuIiwiZGF0YSIsInRleHQiLCJlIiwidGFyZ2V0Iiwic2V0U3RhdGUiLCJpZCIsInJlcGxhY2UiLCJyZXN1bHQiLCJKU09OIiwicGFyc2UiLCJ0aXRsZSIsIkNoYXJ0IiwidGhyZXNob2xkIiwibWFwIiwiaXRlbSIsImkiLCJjcHUiLCJtZW1fcGVyY2VudCIsIm1lbV9yYXciLCJhdmFpbGFibGVfbWVtX3JhdyIsInN3aXRjaF9jaGFydCIsInNlbmRfY29tbWFuZCIsImRhdGFzZXQiLCJ1cmwiLCJDb25zb2xlIiwibWVzc2FnZSIsImNvbF8xIiwiY29sXzIiLCJlbnVtcyIsImFsbG93X2NvbW1hbmRzIiwidmFsdWUiLCJqc29uX3R5cGVzIiwibmFtZSIsIm9iaiIsInBhcmVudF9jb21tZW50IiwiY29tbWVudCIsIk51bWJlciIsImlzSW50ZWdlciIsInR5cGUiLCJoYXNPd25Qcm9wZXJ0eSIsIm9wdGlvbnMiLCJBcnJheSIsImlzQXJyYXkiLCJjaGlsZHJlbiIsImMiLCJPYmplY3QiLCJrZXlzIiwia2V5IiwiaW5jbHVkZXMiLCJwdXNoIiwiQ29uZmlncyIsImZpZWxkcyIsInZhbHVlcyIsImdldF9jb25maWdzIiwic2VuZF9jb25maWdzIiwic2V0X2NvbmZpZyIsImpzb24iLCJmaWVsZF9jb25maWdzIiwicHJvY2Vzc19jb25maWdzIiwidmFscyIsImFzc2lnbiIsImZpZWxkIiwic2VjdGlvbl9tYXBwZXIiLCJTZWN0aW9uIiwic2VsZWN0ZWRfc2VjdGlvbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsT0FBT0EsS0FBUCxJQUFnQkMsU0FBaEIsUUFBaUMsT0FBakM7QUFDQSxPQUFPQyxTQUFQLE1BQXNCLGFBQXRCO0FBQ0EsU0FBU0MsVUFBVCxFQUFxQkMsS0FBckIsUUFBa0MsY0FBbEM7QUFDQSxTQUFTQyxTQUFULEVBQW9CQyxLQUFwQixRQUFpQyxRQUFqQzs7SUFFTUMsTTs7O0FBQ0Ysb0JBQVlDLEtBQVosRUFBbUI7QUFBQTs7QUFBQSxvSEFDVEEsS0FEUzs7QUFFZixjQUFLQyxLQUFMLEdBQWE7QUFDVEMsMEJBQWMsS0FETDtBQUVUQyw0QkFBZ0IsRUFGUDtBQUdUQyx5QkFBYSxFQUhKO0FBSVRDLHVCQUFXLEVBSkY7QUFLVEMsMkJBQWUsRUFMTjtBQU1UQyxxQkFBUyxFQU5BO0FBT1RDLHNCQUFVLEVBUEQ7QUFRVEMsc0JBQVUsRUFSRDtBQVNUQyw0QkFBZ0IsRUFUUDtBQVVUQyxxQkFBUztBQVZBLFNBQWI7O0FBYUEsY0FBS0MsZ0JBQUwsR0FBd0IsTUFBS0EsZ0JBQUwsQ0FBc0JDLElBQXRCLE9BQXhCO0FBQ0EsY0FBS0MsV0FBTCxHQUFtQixNQUFLQSxXQUFMLENBQWlCRCxJQUFqQixPQUFuQjtBQUNBLGNBQUtFLGdCQUFMLEdBQXdCLE1BQUtBLGdCQUFMLENBQXNCRixJQUF0QixPQUF4QjtBQWpCZTtBQWtCbEI7Ozs7MkNBRWtCO0FBQ2YsbUJBQU9HLG9CQUFrQixLQUFLaEIsS0FBTCxDQUFXaUIsYUFBN0IsMkJBQWtFQyxJQUFsRSxDQUNILGdCQUFRO0FBQ0osdUJBQU9DLEtBQUtDLElBQUwsRUFBUDtBQUNILGFBSEUsQ0FBUDtBQUtIOzs7eUNBRWdCQyxDLEVBQUc7QUFDaEIsZ0JBQUlDLFNBQVNELEVBQUVD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QUFDSWtGLHNCQUFVO0FBQUEsdUJBQU07QUFBQTtBQUFBO0FBQUE7QUFBQSxpQkFBTjtBQUFBLGFBQVY7QUFDQTtBQUNKLGFBQUssUUFBTDtBQUNJQSxzQkFBVTtBQUFBLHVCQUFNLG9CQUFDLE9BQUQsRUFBYWxGLEtBQWIsQ0FBTjtBQUFBLGFBQVY7QUFDQTtBQUNKO0FBQ0lrRixzQkFBVTtBQUFBLHVCQUFNLEVBQU47QUFBQSxhQUFWO0FBZFI7QUFnQkEsV0FBT0EsT0FBUDtBQUNILENBbkJNIiwiZmlsZSI6InNlY3Rpb25zLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCB9IGZyb20gXCJyZWFjdFwiXHJcbmltcG9ydCBXZWJTb2NrZXQgZnJvbSBcIi4vd2Vic29ja2V0XCJcclxuaW1wb3J0IHsgSGlzdG9yeUJhciwgSW5wdXQgfSBmcm9tIFwiLi9jb21wb25lbnRzXCJcclxuaW1wb3J0IHsgaXNfb2JqZWN0LCBwcmludCB9IGZyb20gXCIuL3V0aWxcIlxyXG5cclxuY2xhc3MgU3RhdHVzIGV4dGVuZHMgQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpXHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgICAgICAgc2VsZWN0ZWRfdGFiOiBcImNwdVwiLFxyXG4gICAgICAgICAgICB1cGRhdGVfdmVyc2lvbjogXCJcIixcclxuICAgICAgICAgICAgZ2FtZV9zdGF0dXM6IFwiXCIsXHJcbiAgICAgICAgICAgIHRvdGFsX21lbTogXCJcIixcclxuICAgICAgICAgICAgdG90YWxfbWVtX3JhdzogXCJcIixcclxuICAgICAgICAgICAgdmVyc2lvbjogXCJcIixcclxuICAgICAgICAgICAgY3B1X3RleHQ6IFwiXCIsXHJcbiAgICAgICAgICAgIG1lbV90ZXh0OiBcIlwiLFxyXG4gICAgICAgICAgICBhdmFpbF9tZW1fdGV4dDogXCJcIixcclxuICAgICAgICAgICAgaGlzdG9yeTogW10sXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmdldF9nYW1lX3ZlcnNpb24gPSB0aGlzLmdldF9nYW1lX3ZlcnNpb24uYmluZCh0aGlzKVxyXG4gICAgICAgIHRoaXMuaGFuZGxlX2RhdGEgPSB0aGlzLmhhbmRsZV9kYXRhLmJpbmQodGhpcylcclxuICAgICAgICB0aGlzLmNoYW5nZV9jaGFydF90YWIgPSB0aGlzLmNoYW5nZV9jaGFydF90YWIuYmluZCh0aGlzKVxyXG4gICAgfVxyXG5cclxuICAgIGdldF9nYW1lX3ZlcnNpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIGZldGNoKGBmYWN0b3Jpby8ke3RoaXMucHJvcHMuc2VsZWN0ZWRfZ2FtZX0vZ2V0X2N1cnJlbnRfdmVyc2lvbmApLnRoZW4oXHJcbiAgICAgICAgICAgIGRhdGEgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRhdGEudGV4dCgpXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIGNoYW5nZV9jaGFydF90YWIoZSkge1xyXG4gICAgICAgIGxldCB0YXJnZXQgPSBlLnRhcmdldFxyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgICAgICBzZWxlY3RlZF90YWI6IHRhcmdldC5pZC5yZXBsYWNlKFwiZ2FtZV9cIiwgXCJcIikucmVwbGFjZShcIl90YWJcIiwgXCJcIiksXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcclxuICAgICAgICB0aGlzLmdldF9nYW1lX3ZlcnNpb24oKS50aGVuKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICAgICAgICAgIHZlcnNpb246IGRhdGEsXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVfZGF0YShkYXRhKSB7XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IEpTT04ucGFyc2UoZGF0YSlcclxuICAgICAgICBpZiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgICAgICAgICAgZ2FtZV9zdGF0dXM6IHJlc3VsdFswXVtcInN0YXR1c1wiXS50aXRsZSgpLFxyXG4gICAgICAgICAgICAgICAgdG90YWxfbWVtOiByZXN1bHRbMF1bXCJ0b3RhbF9tZW1cIl0sXHJcbiAgICAgICAgICAgICAgICB0b3RhbF9tZW1fcmF3OiByZXN1bHRbMF1bXCJ0b3RhbF9tZW1fcmF3XCJdLFxyXG4gICAgICAgICAgICAgICAgY3B1X3RleHQ6IHJlc3VsdFswXVtcImNwdVwiXSxcclxuICAgICAgICAgICAgICAgIG1lbV90ZXh0OiByZXN1bHRbMF1bXCJtZW1cIl0sXHJcbiAgICAgICAgICAgICAgICBhdmFpbF9tZW1fdGV4dDogcmVzdWx0WzBdW1wiYXZhaWxhYmxlX21lbVwiXSxcclxuICAgICAgICAgICAgICAgIGhpc3Rvcnk6IHJlc3VsdCxcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICAgICAgICAgIGdhbWVfc3RhdHVzOiBcIlN0b3BwZWRcIixcclxuICAgICAgICAgICAgICAgIHRvdGFsX21lbV9yYXc6IFwiXCIsXHJcbiAgICAgICAgICAgICAgICBjcHVfdGV4dDogXCJcIixcclxuICAgICAgICAgICAgICAgIG1lbV90ZXh0OiBcIlwiLFxyXG4gICAgICAgICAgICAgICAgYXZhaWxfbWVtX3RleHQ6IFwiXCIsXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBzZW5kX2NvbW1hbmQoZSkge1xyXG4gICAgICAgIGxldCB0YXJnZXQgPSBlLnRhcmdldFxyXG4gICAgICAgIGZldGNoKHRhcmdldC5kYXRhc2V0LnVybClcclxuICAgIH1cclxuXHJcbiAgICBzd2l0Y2hfY2hhcnQoKSB7XHJcbiAgICAgICAgbGV0IENoYXJ0XHJcbiAgICAgICAgbGV0IHRocmVzaG9sZCA9IDJcclxuICAgICAgICBsZXQgdG90YWxfbWVtID0gdGhpcy5zdGF0ZS50b3RhbF9tZW1fcmF3XHJcbiAgICAgICAgc3dpdGNoICh0aGlzLnN0YXRlLnNlbGVjdGVkX3RhYikge1xyXG4gICAgICAgICAgICBjYXNlIFwiY3B1XCI6XHJcbiAgICAgICAgICAgICAgICBDaGFydCA9ICgpID0+IChcclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPSdnYW1lX2NwdScgY2xhc3NOYW1lPSdjaGFydF9ib3gnPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5zdGF0ZS5oaXN0b3J5Lm1hcCgoaXRlbSwgaSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNwdSA9IGl0ZW0uY3B1XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3B1IDwgdGhyZXNob2xkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3B1ID0gdGhyZXNob2xkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gPEhpc3RvcnlCYXIgaGVpZ2h0PXtjcHV9IGtleT17aX0gbnVtPXtpICogMn0gLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSl9XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICBjYXNlIFwibWVtXCI6XHJcbiAgICAgICAgICAgICAgICBDaGFydCA9ICgpID0+IChcclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPSdnYW1lX21lbScgY2xhc3NOYW1lPSdjaGFydF9ib3gnPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5zdGF0ZS5oaXN0b3J5Lm1hcCgoaXRlbSwgaSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG1lbV9wZXJjZW50ID0gKGl0ZW0ubWVtX3JhdyAvIHRvdGFsX21lbSkgKiAxMDBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtZW1fcGVyY2VudCA8IHRocmVzaG9sZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lbV9wZXJjZW50ID0gdGhyZXNob2xkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxIaXN0b3J5QmFyIGhlaWdodD17bWVtX3BlcmNlbnR9IGtleT17aX0gbnVtPXtpICogMn0gLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSl9XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICBjYXNlIFwiYXZhaWxhYmxlX21lbVwiOlxyXG4gICAgICAgICAgICAgICAgQ2hhcnQgPSAoKSA9PiAoXHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBpZD0nYXZhaWxhYmxlX21lbScgY2xhc3NOYW1lPSdjaGFydF9ib3gnPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5zdGF0ZS5oaXN0b3J5Lm1hcCgoaXRlbSwgaSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG1lbV9wZXJjZW50ID0gKGl0ZW0uYXZhaWxhYmxlX21lbV9yYXcgLyB0b3RhbF9tZW0pICogMTAwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobWVtX3BlcmNlbnQgPCB0aHJlc2hvbGQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZW1fcGVyY2VudCA9IHRocmVzaG9sZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8SGlzdG9yeUJhciBoZWlnaHQ9e21lbV9wZXJjZW50fSBrZXk9e2l9IG51bT17aSAqIDJ9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pfVxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gQ2hhcnRcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgbGV0IHtcclxuICAgICAgICAgICAgc2VsZWN0ZWRfdGFiLFxyXG4gICAgICAgICAgICB1cGRhdGVfdmVyc2lvbixcclxuICAgICAgICAgICAgZ2FtZV9zdGF0dXMsXHJcbiAgICAgICAgICAgIHRvdGFsX21lbSxcclxuICAgICAgICAgICAgdmVyc2lvbixcclxuICAgICAgICAgICAgY3B1X3RleHQsXHJcbiAgICAgICAgICAgIG1lbV90ZXh0LFxyXG4gICAgICAgICAgICBhdmFpbF9tZW1fdGV4dCxcclxuICAgICAgICB9ID0gdGhpcy5zdGF0ZVxyXG4gICAgICAgIGxldCBzZWxlY3RlZF9nYW1lID0gdGhpcy5wcm9wcy5zZWxlY3RlZF9nYW1lXHJcbiAgICAgICAgbGV0IENoYXJ0ID0gdGhpcy5zd2l0Y2hfY2hhcnQoKVxyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8UmVhY3QuRnJhZ21lbnQ+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGlkPSdjaGFydHMnPlxyXG4gICAgICAgICAgICAgICAgICAgIDxDaGFydCAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ9J2dhbWVfY3B1X3RhYidcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkX3RhYiA9PT0gXCJjcHVcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gXCJjaGFydF90YWIgc2VsZWN0ZWRfdGFiXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFwiY2hhcnRfdGFiXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmNoYW5nZV9jaGFydF90YWJ9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBDUFUge2NwdV90ZXh0fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7Y3B1X3RleHQgKyBcIlwiID8gXCIlXCIgOiBcIlwifVxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ9J2dhbWVfbWVtX3RhYidcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkX3RhYiA9PT0gXCJtZW1cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gXCJjaGFydF90YWIgc2VsZWN0ZWRfdGFiXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFwiY2hhcnRfdGFiXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmNoYW5nZV9jaGFydF90YWJ9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBNZW1vcnkge21lbV90ZXh0fVxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ9J2F2YWlsYWJsZV9tZW1fdGFiJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRfdGFiID09PSBcImF2YWlsYWJsZV9tZW1cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gXCJjaGFydF90YWIgc2VsZWN0ZWRfdGFiXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFwiY2hhcnRfdGFiXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmNoYW5nZV9jaGFydF90YWJ9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBBdmFpbGFibGUgTWVtb3J5IHthdmFpbF9tZW1fdGV4dH1cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBpZD0nc3RhdHVzX2J1dHRvbnMnPlxyXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPSdhY3Rpb24nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e1N0YXR1cy5zZW5kX2NvbW1hbmR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEtdXJsPXtgZmFjdG9yaW8vJHtzZWxlY3RlZF9nYW1lfS9zdGFydGB9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBTdGFydCB7c2VsZWN0ZWRfZ2FtZX1cclxuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT0nYWN0aW9uJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXtTdGF0dXMuc2VuZF9jb21tYW5kfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLXVybD17YGZhY3RvcmlvLyR7c2VsZWN0ZWRfZ2FtZX0vc3RvcGB9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBTdG9wIHtzZWxlY3RlZF9nYW1lfVxyXG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPSdhY3Rpb24nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e1N0YXR1cy5zZW5kX2NvbW1hbmR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEtdXJsPXtgZmFjdG9yaW8vJHtzZWxlY3RlZF9nYW1lfS9jaGVja19mb3JfdXBkYXRlYH0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIENoZWNrIGZvciBVcGRhdGVzXHJcbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAge3VwZGF0ZV92ZXJzaW9uICYmIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBWZXJzaW9uIHt1cGRhdGVfdmVyc2lvbn0gaXMgYXZhaWxhYmxlIVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkPSdnZXRfdXBkYXRlJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEtdXJsPXtgZmFjdG9yaW8vJHtzZWxlY3RlZF9nYW1lfS91cGRhdGU/dmVyc2lvbj0ke3ZlcnNpb259YH0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVXBkYXRlIE5vd1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0nc3RhdHMnPkN1cnJlbnQgVmVyc2lvbjoge3ZlcnNpb259PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0nc3RhdHMnPlN0YXR1czoge2dhbWVfc3RhdHVzfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9J3N0YXRzJz5Ub3RhbCBTeXN0ZW0gTWVtb3J5OiB7dG90YWxfbWVtfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPFdlYlNvY2tldFxyXG4gICAgICAgICAgICAgICAgICAgIHVybD17YHdzL2ZhY3RvcmlvX3N0YXR1cz9uYW1lPSR7c2VsZWN0ZWRfZ2FtZX1gfVxyXG4gICAgICAgICAgICAgICAgICAgIG9uTWVzc2FnZT17dGhpcy5oYW5kbGVfZGF0YX1cclxuICAgICAgICAgICAgICAgICAgICBvbk9wZW49eygpID0+IGZldGNoKFwic3RhcnRfc3RyZWFtL2ZhY3RvcmlvXCIpfVxyXG4gICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgPC9SZWFjdC5GcmFnbWVudD5cclxuICAgICAgICApXHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIENvbnNvbGUgZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcylcclxuXHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgICAgICAgaGlzdG9yeTogW10sXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmhhbmRsZV9kYXRhID0gdGhpcy5oYW5kbGVfZGF0YS5iaW5kKHRoaXMpXHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlX2RhdGEoZGF0YSkge1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBKU09OLnBhcnNlKGRhdGEpXHJcbiAgICAgICAgaWYgKHJlc3VsdCkge1xyXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgaGlzdG9yeTogWy4uLnRoaXMuc3RhdGUuaGlzdG9yeSwgcmVzdWx0XSB9KVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgbGV0IHsgaGlzdG9yeSB9ID0gdGhpcy5zdGF0ZVxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgaWQ9J2NvbnNvbGVfYm94Jz5cclxuICAgICAgICAgICAgICAgIHtoaXN0b3J5Lm1hcCgobWVzc2FnZSwgaSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdjb25zb2xlX2xpbmUnIGtleT17aX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7bWVzc2FnZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgfSl9XHJcbiAgICAgICAgICAgICAgICA8V2ViU29ja2V0XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsPXtgd3MvbG9nX3RhaWw/bmFtZT0ke3RoaXMucHJvcHMuc2VsZWN0ZWRfZ2FtZX1gfVxyXG4gICAgICAgICAgICAgICAgICAgIG9uTWVzc2FnZT17dGhpcy5oYW5kbGVfZGF0YX1cclxuICAgICAgICAgICAgICAgICAgICBvbk9wZW49eygpID0+IGZldGNoKFwic3RhcnRfc3RyZWFtL2xvZ1wiKX1cclxuICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIClcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgY29sXzEgPSBbXHJcbiAgICBcImFma19hdXRva2lja19pbnRlcnZhbFwiLFxyXG4gICAgXCJhdXRvc2F2ZV9pbnRlcnZhbFwiLFxyXG4gICAgXCJhdXRvc2F2ZV9zbG90c1wiLFxyXG4gICAgXCJtYXhfcGxheWVyc1wiLFxyXG4gICAgXCJtYXhfdXBsb2FkX2luX2tpbG9ieXRlc19wZXJfc2Vjb25kXCIsXHJcbiAgICBcIm1pbmltdW1fbGF0ZW5jeV9pbl90aWNrc1wiLFxyXG4gICAgXCJkZXNjcmlwdGlvblwiLFxyXG4gICAgXCJnYW1lX3Bhc3N3b3JkXCIsXHJcbiAgICBcIm5hbWVcIixcclxuICAgIFwidXNlcm5hbWVcIixcclxuICAgIFwicGFzc3dvcmRcIixcclxuICAgIFwidG9rZW5cIixcclxuICAgIFwiYWxsb3dfY29tbWFuZHNcIixcclxuXVxyXG5jb25zdCBjb2xfMiA9IFtcclxuICAgIFwiYWRtaW5zXCIsXHJcbiAgICBcInRhZ3NcIixcclxuICAgIFwiYXV0b19wYXVzZVwiLFxyXG4gICAgXCJhdXRvc2F2ZV9vbmx5X29uX3NlcnZlclwiLFxyXG4gICAgXCJpZ25vcmVfcGxheWVyX2xpbWl0X2Zvcl9yZXR1cm5pbmdfcGxheWVyc1wiLFxyXG4gICAgXCJvbmx5X2FkbWluc19jYW5fcGF1c2VfdGhlX2dhbWVcIixcclxuICAgIFwicmVxdWlyZV91c2VyX3ZlcmlmaWNhdGlvblwiLFxyXG4gICAgXCJ2aXNpYmlsaXR5XCIsXHJcbl1cclxuY29uc3QgZW51bXMgPSB7XHJcbiAgICBhbGxvd19jb21tYW5kczogW1xyXG4gICAgICAgIHsgdmFsdWU6IFwidHJ1ZVwiLCB0ZXh0OiBcIlRydWVcIiB9LFxyXG4gICAgICAgIHsgdmFsdWU6IFwiZmFsc2VcIiwgdGV4dDogXCJGYWxzZVwiIH0sXHJcbiAgICAgICAgeyB2YWx1ZTogXCJhZG1pbnMtb25seVwiLCB0ZXh0OiBcIkFkbWlucyBPbmx5XCIgfSxcclxuICAgIF0sXHJcbn1cclxuXHJcbmxldCBqc29uX3R5cGVzID0gKG5hbWUsIG9iaiwgcGFyZW50X2NvbW1lbnQpID0+IHtcclxuICAgIGxldCB2YWx1ZSA9IG9ialtuYW1lXVxyXG4gICAgbGV0IGNvbW1lbnQgPSBvYmpbYF9jb21tZW50XyR7bmFtZX1gXVxyXG4gICAgaWYgKHBhcmVudF9jb21tZW50KSB7XHJcbiAgICAgICAgY29tbWVudCA9IHBhcmVudF9jb21tZW50XHJcbiAgICB9XHJcbiAgICBpZiAodHlwZW9mIHZhbHVlICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgaWYgKE51bWJlci5pc0ludGVnZXIodmFsdWUpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiBuYW1lLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJudW1iZXJcIixcclxuICAgICAgICAgICAgICAgIGNvbW1lbnQ6IGNvbW1lbnQsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICBpZiAoZW51bXMuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogbmFtZSxcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWUsXHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9uczogZW51bXNbbmFtZV0sXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJzZWxlY3RcIixcclxuICAgICAgICAgICAgICAgICAgICBjb21tZW50OiBjb21tZW50LFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBuYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInRleHRcIixcclxuICAgICAgICAgICAgICAgICAgICBjb21tZW50OiBjb21tZW50LFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09IFwiYm9vbGVhblwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiBuYW1lLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJjaGVja2JveFwiLFxyXG4gICAgICAgICAgICAgICAgY29tbWVudDogY29tbWVudCxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIG5hbWU6IG5hbWUsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWUsXHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcImxpc3RcIixcclxuICAgICAgICAgICAgICAgIGNvbW1lbnQ6IGNvbW1lbnQsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKGlzX29iamVjdCh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgbGV0IGNoaWxkcmVuID0gW11cclxuICAgICAgICAgICAgbGV0IGNcclxuICAgICAgICAgICAgZm9yIChsZXQga2V5IG9mIE9iamVjdC5rZXlzKHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoY29tbWVudCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGMgb2YgY29tbWVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYy5pbmNsdWRlcyhrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2hpbGRyZW4ucHVzaChqc29uX3R5cGVzKGtleSwgdmFsdWUsIGMpKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiBuYW1lLFxyXG4gICAgICAgICAgICAgICAgY2hpbGRyZW46IGNoaWxkcmVuLFxyXG4gICAgICAgICAgICAgICAgY29tbWVudDogY29tbWVudCxcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwicGFyZW50XCIsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIENvbmZpZ3MgZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcylcclxuXHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgICAgICAgZmllbGRzOiB7fSxcclxuICAgICAgICAgICAgdmFsdWVzOiB7fSxcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZ2V0X2NvbmZpZ3MgPSB0aGlzLmdldF9jb25maWdzLmJpbmQodGhpcylcclxuICAgICAgICB0aGlzLnNlbmRfY29uZmlncyA9IHRoaXMuc2VuZF9jb25maWdzLmJpbmQodGhpcylcclxuICAgICAgICB0aGlzLnNldF9jb25maWcgPSB0aGlzLnNldF9jb25maWcuYmluZCh0aGlzKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcclxuICAgICAgICB0aGlzLmdldF9jb25maWdzKClcclxuICAgIH1cclxuXHJcbiAgICBnZXRfY29uZmlncygpIHtcclxuICAgICAgICBmZXRjaChgZmFjdG9yaW8vJHt0aGlzLnByb3BzLnNlbGVjdGVkX2dhbWV9L3NlcnZlcl9jb25maWdgKVxyXG4gICAgICAgICAgICAudGhlbihyZXN1bHQgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdC5qc29uKClcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnRoZW4ocmVzdWx0ID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBmaWVsZF9jb25maWdzID0gQ29uZmlncy5wcm9jZXNzX2NvbmZpZ3MocmVzdWx0KVxyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGZpZWxkczogZmllbGRfY29uZmlncyB9KVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBwcm9jZXNzX2NvbmZpZ3MoZmllbGRzKSB7XHJcbiAgICAgICAgbGV0IGZpZWxkX2NvbmZpZ3MgPSB7IGNvbF8xOiBbXSwgY29sXzI6IFtdIH1cclxuICAgICAgICBmb3IgKGxldCBuYW1lIG9mIGNvbF8xKSB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZmllbGRzW25hbWVdICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgICAgICBmaWVsZF9jb25maWdzLmNvbF8xLnB1c2goanNvbl90eXBlcyhuYW1lLCBmaWVsZHMpKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAobGV0IG5hbWUgb2YgY29sXzIpIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBmaWVsZHNbbmFtZV0gIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgICAgIGZpZWxkX2NvbmZpZ3MuY29sXzIucHVzaChqc29uX3R5cGVzKG5hbWUsIGZpZWxkcykpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZpZWxkX2NvbmZpZ3NcclxuICAgIH1cclxuXHJcbiAgICBzZW5kX2NvbmZpZ3MoKSB7XHJcbiAgICAgICAgcHJpbnQodGhpcy5zdGF0ZS5maWVsZHMpXHJcbiAgICAgICAgcHJpbnQodGhpcy5zdGF0ZS52YWx1ZXMpXHJcbiAgICAgICAgLy8gZmV0Y2goYGZhY3RvcmlvLyR7dGhpcy5wcm9wcy5zZWxlY3RlZF9nYW1lfS91cGRhdGVfc2VydmVyX2NvbmZpZ3NgLCB7XHJcbiAgICAgICAgLy8gICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgLy8gICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHRoaXMuc3RhdGUuZmllbGRzKSxcclxuICAgICAgICAvLyAgICAgaGVhZGVyczoge1xyXG4gICAgICAgIC8vICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXHJcbiAgICAgICAgLy8gICAgIH0sXHJcbiAgICAgICAgLy8gICAgIGNyZWRlbnRpYWxzOiBcIm9taXRcIixcclxuICAgICAgICAvLyB9KVxyXG4gICAgfVxyXG5cclxuICAgIHNldF9jb25maWcoKSB7XHJcbiAgICAgICAgbGV0IG5hbWUsIHZhbHVlXHJcbiAgICAgICAgbGV0IHZhbHMgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnN0YXRlLnZhbHVlcylcclxuICAgICAgICB2YWxzW25hbWVdID0gdmFsdWVcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICAgICAgdmFsdWVzOiB2YWxzLFxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGxldCB7IGZpZWxkcyB9ID0gdGhpcy5zdGF0ZVxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgaWQ9J2NvbmZpZ19zZWMnPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2NvbHVtbnMnPlxyXG4gICAgICAgICAgICAgICAgICAgIHtmaWVsZHMuY29sXzEgJiYgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nY29sdW1uJz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtmaWVsZHMuY29sXzEubWFwKGZpZWxkID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8SW5wdXRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleT17ZmllbGQubmFtZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsuLi5maWVsZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNldF9jb25maWc9e3RoaXMuc2V0X2NvbmZpZ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJlZj17bm9kZSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICh0aGlzLnN0YXRlLnZhbHVlc1tmaWVsZC5uYW1lXSA9IG5vZGUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICAgICAge2ZpZWxkcy5jb2xfMiAmJiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdjb2x1bW4nPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge2ZpZWxkcy5jb2xfMi5tYXAoZmllbGQgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxJbnB1dFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5PXtmaWVsZC5uYW1lfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgey4uLmZpZWxkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2V0X2NvbmZpZz17dGhpcy5zZXRfY29uZmlnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmVmPXtub2RlID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgKHRoaXMuc3RhdGUudmFsdWVzW2ZpZWxkLm5hbWVdID0gbm9kZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD0nc2F2ZV9zZXJ2ZXJfY29uZmlnJyBvbkNsaWNrPXt0aGlzLnNlbmRfY29uZmlnc30+XHJcbiAgICAgICAgICAgICAgICAgICAgU2F2ZVxyXG4gICAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIClcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGxldCBzZWN0aW9uX21hcHBlciA9IHByb3BzID0+IHtcclxuICAgIGxldCBTZWN0aW9uXHJcbiAgICBzd2l0Y2ggKHByb3BzLnNlbGVjdGVkX3NlY3Rpb24pIHtcclxuICAgICAgICBjYXNlIFwic3RhdHVzXCI6XHJcbiAgICAgICAgICAgIFNlY3Rpb24gPSAoKSA9PiA8U3RhdHVzIHsuLi5wcm9wc30gLz5cclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICBjYXNlIFwiY29uc29sZVwiOlxyXG4gICAgICAgICAgICBTZWN0aW9uID0gKCkgPT4gPENvbnNvbGUgey4uLnByb3BzfSAvPlxyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgIGNhc2UgXCJtb2RzXCI6XHJcbiAgICAgICAgICAgIFNlY3Rpb24gPSAoKSA9PiA8ZGl2PlRPRE8gbW9kczwvZGl2PlxyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgIGNhc2UgXCJjb25maWdcIjpcclxuICAgICAgICAgICAgU2VjdGlvbiA9ICgpID0+IDxDb25maWdzIHsuLi5wcm9wc30gLz5cclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICBTZWN0aW9uID0gKCkgPT4gXCJcIlxyXG4gICAgfVxyXG4gICAgcmV0dXJuIFNlY3Rpb25cclxufVxyXG4iXX0=