var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";

export var Header = function Header(_ref) {
    var username = _ref.username,
        games = _ref.games,
        selected = _ref.selected,
        section = _ref.section,
        change_game = _ref.change_game;
    return React.createElement(
        'header',
        null,
        React.createElement(
            'div',
            { id: 'greeting' },
            'Hello ',
            username,
            '!'
        ),
        React.createElement(
            'label',
            { id: 'selected_game_label' },
            'Current Game',
            React.createElement(
                'select',
                { id: 'selected_game', value: selected, onChange: change_game },
                games.map(function (game, i) {
                    return React.createElement(
                        'option',
                        { key: i },
                        game
                    );
                })
            )
        ),
        React.createElement(
            'form',
            { id: 'logout_form', method: 'post', action: '/auth/logout' },
            React.createElement('input', { id: 'logout_button', type: 'submit', value: 'Log Out' })
        ),
        React.createElement(
            'button',
            { id: 'restart_fsm', 'data-url': 'restart_server' },
            'Restart FSM'
        ),
        React.createElement(
            'div',
            { id: 'title' },
            'Factorio ',
            React.createElement(
                'span',
                { id: 'title_label' },
                section.title()
            )
        )
    );
};

export var Nav = function Nav(_ref2) {
    var navs = _ref2.navs,
        selected = _ref2.selected,
        change_section = _ref2.change_section;
    return React.createElement(
        'nav',
        null,
        React.createElement(
            'ul',
            { id: 'nav_links' },
            navs.map(function (nav, i) {
                return React.createElement(
                    'li',
                    {
                        id: nav + "_nav",
                        key: i,
                        className: nav === selected ? "selected_nav" : "",
                        onClick: change_section },
                    nav.title()
                );
            })
        )
    );
};

export var HistoryBar = function HistoryBar(_ref3) {
    var height = _ref3.height,
        num = _ref3.num;
    return React.createElement('div', {
        style: { height: height + '%', left: 'calc(' + num + '% + 5px)' },
        className: 'history_bar'
    });
};

var Overlay = function (_Component) {
    _inherits(Overlay, _Component);

    function Overlay(props) {
        _classCallCheck(this, Overlay);

        var _this = _possibleConstructorReturn(this, (Overlay.__proto__ || Object.getPrototypeOf(Overlay)).call(this, props));

        _this.handleClick = _this.handleClick.bind(_this);
        return _this;
    }

    _createClass(Overlay, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.input.focus();
        }
    }, {
        key: 'handleClick',
        value: function handleClick(e) {
            if (!this.node.contains(e.target)) {
                this.props.toggle_overlay();
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _props = this.props,
                overlay_value = _props.overlay_value,
                message = _props.message,
                error_msg = _props.error_msg,
                add_item = _props.add_item,
                check_list = _props.check_list;

            return React.createElement(
                'div',
                { id: 'overlay', onClick: this.handleClick },
                React.createElement(
                    'div',
                    { id: 'overlay_cell' },
                    React.createElement(
                        'div',
                        { id: 'overlay_msg', ref: function ref(node) {
                                return _this2.node = node;
                            } },
                        error_msg && React.createElement(
                            'div',
                            { id: 'error' },
                            error_msg
                        ),
                        React.createElement(
                            'div',
                            null,
                            message.title(),
                            ' Entry'
                        ),
                        React.createElement('input', {
                            defaultValue: overlay_value,
                            onChange: check_list,
                            onKeyUp: check_list,
                            ref: function ref(node) {
                                return _this2.input = node;
                            }
                        }),
                        React.createElement(
                            'button',
                            { onClick: add_item },
                            'Enter'
                        )
                    )
                )
            );
        }
    }]);

    return Overlay;
}(Component);

var ListItem = function ListItem(_ref4) {
    var name = _ref4.name,
        remove = _ref4.remove;
    return React.createElement(
        'div',
        { className: 'list_item' },
        name,
        React.createElement(
            'div',
            { className: 'remove', title: 'Remove', 'data-name': name, onClick: remove },
            '\xD7'
        )
    );
};

export var List = function (_Component2) {
    _inherits(List, _Component2);

    function List(props) {
        _classCallCheck(this, List);

        var _this3 = _possibleConstructorReturn(this, (List.__proto__ || Object.getPrototypeOf(List)).call(this, props));

        _this3.state = {
            items: _this3.props.value,
            show_overlay: false,
            overlay_value: "",
            error_msg: ""
        };
        _this3.toggle_overlay = _this3.toggle_overlay.bind(_this3);
        _this3.add = _this3.add.bind(_this3);
        _this3.check_list = _this3.check_list.bind(_this3);
        _this3.remove = _this3.remove.bind(_this3);
        return _this3;
    }

    _createClass(List, [{
        key: 'toggle_overlay',
        value: function toggle_overlay() {
            this.setState({ show_overlay: !this.state.show_overlay });
        }
    }, {
        key: 'add',
        value: function add() {
            var value = this.state.overlay_value;
            var items = this.state.items;
            if (value && !items.includes(value)) {
                this.setState({
                    items: [].concat(_toConsumableArray(items), [value]),
                    overlay_value: "",
                    show_overlay: false
                });
            }
        }
    }, {
        key: 'check_list',
        value: function check_list(e) {
            var value = e.target.value;
            var items = this.state.items;
            if (value && !items.includes(value)) {
                this.state.overlay_value = value;
                this.setState({ error_msg: "" });
                if (e.key === "Enter") {
                    this.add();
                }
            } else {
                this.setState({ error_msg: "That entry already exists" });
            }
        }
    }, {
        key: 'remove',
        value: function remove(e) {
            var item = e.target.dataset.name;
            var items = this.state.items;
            if (items.includes(item)) {
                items.splice(items.indexOf(item), 1);
                this.setState({
                    items: items
                });
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this4 = this;

            var _state = this.state,
                show_overlay = _state.show_overlay,
                overlay_value = _state.overlay_value,
                error_msg = _state.error_msg,
                items = _state.items;

            return React.createElement(
                'div',
                { className: 'label' },
                React.createElement(
                    'div',
                    null,
                    this.props.name.title()
                ),
                React.createElement(
                    'button',
                    { className: 'add_button', onClick: this.toggle_overlay },
                    'Add'
                ),
                React.createElement(
                    'div',
                    { className: 'list' },
                    items.map(function (item) {
                        return React.createElement(ListItem, { key: item, name: item, remove: _this4.remove });
                    })
                ),
                show_overlay && React.createElement(Overlay, {
                    overlay_value: overlay_value,
                    message: this.props.name,
                    error_msg: error_msg,
                    toggle_overlay: this.toggle_overlay,
                    add_item: this.add,
                    check_list: this.check_list
                })
            );
        }
    }]);

    return List;
}(Component);

export var Input = function (_Component3) {
    _inherits(Input, _Component3);

    function Input(props) {
        _classCallCheck(this, Input);

        var _this5 = _possibleConstructorReturn(this, (Input.__proto__ || Object.getPrototypeOf(Input)).call(this, props));

        _this5.state = {
            value: _this5.props.value
        };
        _this5.toggle_checkbox = _this5.toggle_checkbox.bind(_this5);
        _this5.set_value = _this5.set_value.bind(_this5);
        return _this5;
    }

    _createClass(Input, [{
        key: 'toggle_checkbox',
        value: function toggle_checkbox(e) {
            print(!this.state.value);
            e.preventDefault();
            this.setState({
                value: !this.state.value
            });
        }
    }, {
        key: 'set_value',
        value: function set_value(e) {
            var target = e.target;
            this.setState({
                value: target.value
            });
            print(target.value);
        }
    }, {
        key: 'render',
        value: function render() {
            var input = void 0;
            var _props2 = this.props,
                name = _props2.name,
                type = _props2.type,
                comment = _props2.comment,
                options = _props2.options,
                children = _props2.children,
                value = _props2.value;

            var message = name.replaceAll("_", " ").title();
            switch (type) {
                case "checkbox":
                    input = React.createElement(
                        'label',
                        {
                            className: 'checkbox_label',
                            onClick: this.toggle_checkbox,
                            'data-comment': comment },
                        React.createElement('input', { name: name, type: 'checkbox', value: value }),
                        React.createElement(
                            'span',
                            { className: 'checkbox_title' },
                            message
                        ),
                        React.createElement('span', {
                            className: value ? "checkbox_custom checked" : "checkbox_custom"
                        })
                    );
                    break;
                case "select":
                    input = React.createElement(
                        'label',
                        { 'data-comment': comment },
                        React.createElement(
                            'span',
                            { className: 'input_title' },
                            message
                        ),
                        React.createElement(
                            'select',
                            {
                                name: name,
                                defaultValue: value,
                                onChange: this.set_value },
                            options.map(function (option, i) {
                                return React.createElement(
                                    'option',
                                    { key: i, value: option.value },
                                    option.text
                                );
                            })
                        )
                    );
                    break;
                case "list":
                    input = React.createElement(List, { name: name, value: value, set_config: this.set_value });
                    break;
                case "text":
                    input = React.createElement(
                        'label',
                        { 'data-comment': comment },
                        React.createElement(
                            'span',
                            { className: 'input_title' },
                            message
                        ),
                        React.createElement('input', {
                            name: name,
                            defaultValue: value,
                            className: 'text',
                            autoComplete: 'off',
                            onKeyUp: this.set_value
                        })
                    );
                    break;
                case "parent":
                    input = React.createElement(
                        'div',
                        { className: 'parent' },
                        React.createElement(
                            'div',
                            null,
                            message
                        ),
                        children.length && children.map(function (child, i) {
                            return React.createElement(Input, _extends({ key: i }, child));
                        })
                    );
                    break;
                case "number":
                default:
                    input = React.createElement(
                        'label',
                        { 'data-comment': comment },
                        React.createElement(
                            'span',
                            { className: 'input_title' },
                            message
                        ),
                        React.createElement('input', {
                            name: name,
                            defaultValue: value,
                            type: type,
                            onChange: this.set_value
                        })
                    );
            }

            return input;
        }
    }]);

    return Input;
}(Component);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2pzeC9jb21wb25lbnRzLmpzeCJdLCJuYW1lcyI6WyJSZWFjdCIsIkNvbXBvbmVudCIsIkhlYWRlciIsInVzZXJuYW1lIiwiZ2FtZXMiLCJzZWxlY3RlZCIsInNlY3Rpb24iLCJjaGFuZ2VfZ2FtZSIsIm1hcCIsImdhbWUiLCJpIiwidGl0bGUiLCJOYXYiLCJuYXZzIiwiY2hhbmdlX3NlY3Rpb24iLCJuYXYiLCJIaXN0b3J5QmFyIiwiaGVpZ2h0IiwibnVtIiwibGVmdCIsIk92ZXJsYXkiLCJwcm9wcyIsImhhbmRsZUNsaWNrIiwiYmluZCIsImlucHV0IiwiZm9jdXMiLCJlIiwibm9kZSIsImNvbnRhaW5zIiwidGFyZ2V0IiwidG9nZ2xlX292ZXJsYXkiLCJvdmVybGF5X3ZhbHVlIiwibWVzc2FnZSIsImVycm9yX21zZyIsImFkZF9pdGVtIiwiY2hlY2tfbGlzdCIsIkxpc3RJdGVtIiwibmFtZSIsInJlbW92ZSIsIkxpc3QiLCJzdGF0ZSIsIml0ZW1zIiwidmFsdWUiLCJzaG93X292ZXJsYXkiLCJhZGQiLCJzZXRTdGF0ZSIsImluY2x1ZGVzIiwia2V5IiwiaXRlbSIsImRhdGFzZXQiLCJzcGxpY2UiLCJpbmRleE9mIiwiSW5wdXQiLCJ0b2dnbGVfY2hlY2tib3giLCJzZXRfdmFsdWUiLCJwcmludCIsInByZXZlbnREZWZhdWx0IiwidHlwZSIsImNvbW1lbnQiLCJvcHRpb25zIiwiY2hpbGRyZW4iLCJyZXBsYWNlQWxsIiwib3B0aW9uIiwidGV4dCIsImxlbmd0aCIsImNoaWxkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxPQUFPQSxLQUFQLElBQWdCQyxTQUFoQixRQUFpQyxPQUFqQzs7QUFFQSxPQUFPLElBQU1DLFNBQVMsU0FBVEEsTUFBUztBQUFBLFFBQUdDLFFBQUgsUUFBR0EsUUFBSDtBQUFBLFFBQWFDLEtBQWIsUUFBYUEsS0FBYjtBQUFBLFFBQW9CQyxRQUFwQixRQUFvQkEsUUFBcEI7QUFBQSxRQUE4QkMsT0FBOUIsUUFBOEJB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S0FBS1ksU0FBakQsR0FBUjtBQUNBO0FBQ0oscUJBQUssTUFBTDtBQUNJOUIsNEJBQ0k7QUFBQTtBQUFBLDBCQUFPLGdCQUFja0MsT0FBckI7QUFDSTtBQUFBO0FBQUEsOEJBQU0sV0FBVSxhQUFoQjtBQUErQjFCO0FBQS9CLHlCQURKO0FBRUk7QUFDSSxrQ0FBTUssSUFEVjtBQUVJLDBDQUFjSyxLQUZsQjtBQUdJLHVDQUFVLE1BSGQ7QUFJSSwwQ0FBYSxLQUpqQjtBQUtJLHFDQUFTLEtBQUtZO0FBTGxCO0FBRkoscUJBREo7QUFZQTtBQUNKLHFCQUFLLFFBQUw7QUFDSTlCLDRCQUNJO0FBQUE7QUFBQSwwQkFBSyxXQUFVLFFBQWY7QUFDSTtBQUFBO0FBQUE7QUFBTVE7QUFBTix5QkFESjtBQUVLNEIsaUNBQVNJLE1BQVQsSUFDR0osU0FBU3BELEdBQVQsQ0FBYSxVQUFDeUQsS0FBRCxFQUFRdkQsQ0FBUixFQUFjO0FBQ3ZCLG1DQUFPLG9CQUFDLEtBQUQsYUFBTyxLQUFLQSxDQUFaLElBQW1CdUQsS0FBbkIsRUFBUDtBQUNILHlCQUZEO0FBSFIscUJBREo7QUFTQTtBQUNKLHFCQUFLLFFBQUw7QUFDQTtBQUNJekMsNEJBQ0k7QUFBQTtBQUFBLDBCQUFPLGdCQUFja0MsT0FBckI7QUFDSTtBQUFBO0FBQUEsOEJBQU0sV0FBVSxhQUFoQjtBQUErQjFCO0FBQS9CLHlCQURKO0FBRUk7QUFDSSxrQ0FBTUssSUFEVjtBQUVJLDBDQUFjSyxLQUZsQjtBQUdJLGtDQUFNZSxJQUhWO0FBSUksc0NBQVUsS0FBS0g7QUFKbkI7QUFGSixxQkFESjtBQWxFUjs7QUErRUEsbUJBQU85QixLQUFQO0FBQ0g7QUE5R0w7O0FBQUE7QUFBQSxFQUEyQnZCLFNBQTNCIiwiZmlsZSI6ImNvbXBvbmVudHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSBcInJlYWN0XCJcclxuXHJcbmV4cG9ydCBjb25zdCBIZWFkZXIgPSAoeyB1c2VybmFtZSwgZ2FtZXMsIHNlbGVjdGVkLCBzZWN0aW9uLCBjaGFuZ2VfZ2FtZSB9KSA9PiAoXHJcbiAgICA8aGVhZGVyPlxyXG4gICAgICAgIDxkaXYgaWQ9J2dyZWV0aW5nJz5IZWxsbyB7dXNlcm5hbWV9ITwvZGl2PlxyXG4gICAgICAgIDxsYWJlbCBpZD0nc2VsZWN0ZWRfZ2FtZV9sYWJlbCc+XHJcbiAgICAgICAgICAgIEN1cnJlbnQgR2FtZVxyXG4gICAgICAgICAgICA8c2VsZWN0IGlkPSdzZWxlY3RlZF9nYW1lJyB2YWx1ZT17c2VsZWN0ZWR9IG9uQ2hhbmdlPXtjaGFuZ2VfZ2FtZX0+XHJcbiAgICAgICAgICAgICAgICB7Z2FtZXMubWFwKChnYW1lLCBpKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDxvcHRpb24ga2V5PXtpfT57Z2FtZX08L29wdGlvbj5cclxuICAgICAgICAgICAgICAgIH0pfVxyXG4gICAgICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICA8L2xhYmVsPlxyXG4gICAgICAgIDxmb3JtIGlkPSdsb2dvdXRfZm9ybScgbWV0aG9kPSdwb3N0JyBhY3Rpb249Jy9hdXRoL2xvZ291dCc+XHJcbiAgICAgICAgICAgIDxpbnB1dCBpZD0nbG9nb3V0X2J1dHRvbicgdHlwZT0nc3VibWl0JyB2YWx1ZT0nTG9nIE91dCcgLz5cclxuICAgICAgICA8L2Zvcm0+XHJcbiAgICAgICAgPGJ1dHRvbiBpZD0ncmVzdGFydF9mc20nIGRhdGEtdXJsPSdyZXN0YXJ0X3NlcnZlcic+XHJcbiAgICAgICAgICAgIFJlc3RhcnQgRlNNXHJcbiAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgPGRpdiBpZD0ndGl0bGUnPlxyXG4gICAgICAgICAgICBGYWN0b3JpbyA8c3BhbiBpZD0ndGl0bGVfbGFiZWwnPntzZWN0aW9uLnRpdGxlKCl9PC9zcGFuPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgPC9oZWFkZXI+XHJcbilcclxuXHJcbmV4cG9ydCBjb25zdCBOYXYgPSAoeyBuYXZzLCBzZWxlY3RlZCwgY2hhbmdlX3NlY3Rpb24gfSkgPT4gKFxyXG4gICAgPG5hdj5cclxuICAgICAgICA8dWwgaWQ9J25hdl9saW5rcyc+XHJcbiAgICAgICAgICAgIHtuYXZzLm1hcCgobmF2LCBpKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgICAgICAgIDxsaVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZD17bmF2ICsgXCJfbmF2XCJ9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleT17aX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtuYXYgPT09IHNlbGVjdGVkID8gXCJzZWxlY3RlZF9uYXZcIiA6IFwiXCJ9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e2NoYW5nZV9zZWN0aW9ufT5cclxuICAgICAgICAgICAgICAgICAgICAgICAge25hdi50aXRsZSgpfVxyXG4gICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgIH0pfVxyXG4gICAgICAgIDwvdWw+XHJcbiAgICA8L25hdj5cclxuKVxyXG5cclxuLy8gZXhwb3J0IGNvbnN0IFNlbmRCdXR0b24gPSAoeyB0ZXh0LCB1cmwsIG9uX2NsaWNrIH0pID0+IChcclxuLy8gICAgIDxidXR0b24gZGF0YS11cmw9e3VybH0gb25DbGljaz17b25fY2xpY2t9PlxyXG4vLyAgICAgICAgIHt0ZXh0fVxyXG4vLyAgICAgPC9idXR0b24+XHJcbi8vIClcclxuXHJcbmV4cG9ydCBjb25zdCBIaXN0b3J5QmFyID0gKHsgaGVpZ2h0LCBudW0gfSkgPT4gKFxyXG4gICAgPGRpdlxyXG4gICAgICAgIHN0eWxlPXt7IGhlaWdodDogYCR7aGVpZ2h0fSVgLCBsZWZ0OiBgY2FsYygke251bX0lICsgNXB4KWAgfX1cclxuICAgICAgICBjbGFzc05hbWU9J2hpc3RvcnlfYmFyJ1xyXG4gICAgLz5cclxuKVxyXG5cclxuY2xhc3MgT3ZlcmxheSBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKVxyXG4gICAgICAgIHRoaXMuaGFuZGxlQ2xpY2sgPSB0aGlzLmhhbmRsZUNsaWNrLmJpbmQodGhpcylcclxuICAgIH1cclxuXHJcbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcclxuICAgICAgICB0aGlzLmlucHV0LmZvY3VzKClcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVDbGljayhlKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLm5vZGUuY29udGFpbnMoZS50YXJnZXQpKSB7XHJcbiAgICAgICAgICAgIHRoaXMucHJvcHMudG9nZ2xlX292ZXJsYXkoKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgbGV0IHsgb3ZlcmxheV92YWx1ZSwgbWVzc2FnZSwgZXJyb3JfbXNnLCBhZGRfaXRlbSwgY2hlY2tfbGlzdCB9ID0gdGhpcy5wcm9wc1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgaWQ9J292ZXJsYXknIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2t9PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBpZD0nb3ZlcmxheV9jZWxsJz5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPSdvdmVybGF5X21zZycgcmVmPXtub2RlID0+ICh0aGlzLm5vZGUgPSBub2RlKX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtlcnJvcl9tc2cgJiYgPGRpdiBpZD0nZXJyb3InPntlcnJvcl9tc2d9PC9kaXY+fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PnttZXNzYWdlLnRpdGxlKCl9IEVudHJ5PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdFZhbHVlPXtvdmVybGF5X3ZhbHVlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e2NoZWNrX2xpc3R9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbktleVVwPXtjaGVja19saXN0fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVmPXtub2RlID0+ICh0aGlzLmlucHV0ID0gbm9kZSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17YWRkX2l0ZW19PkVudGVyPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKVxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBMaXN0SXRlbSA9ICh7IG5hbWUsIHJlbW92ZSB9KSA9PiAoXHJcbiAgICA8ZGl2IGNsYXNzTmFtZT0nbGlzdF9pdGVtJz5cclxuICAgICAgICB7bmFtZX1cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ncmVtb3ZlJyB0aXRsZT0nUmVtb3ZlJyBkYXRhLW5hbWU9e25hbWV9IG9uQ2xpY2s9e3JlbW92ZX0+XHJcbiAgICAgICAgICAgICZ0aW1lcztcclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4pXHJcblxyXG5leHBvcnQgY2xhc3MgTGlzdCBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKVxyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgICAgICAgIGl0ZW1zOiB0aGlzLnByb3BzLnZhbHVlLFxyXG4gICAgICAgICAgICBzaG93X292ZXJsYXk6IGZhbHNlLFxyXG4gICAgICAgICAgICBvdmVybGF5X3ZhbHVlOiBcIlwiLFxyXG4gICAgICAgICAgICBlcnJvcl9tc2c6IFwiXCIsXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudG9nZ2xlX292ZXJsYXkgPSB0aGlzLnRvZ2dsZV9vdmVybGF5LmJpbmQodGhpcylcclxuICAgICAgICB0aGlzLmFkZCA9IHRoaXMuYWRkLmJpbmQodGhpcylcclxuICAgICAgICB0aGlzLmNoZWNrX2xpc3QgPSB0aGlzLmNoZWNrX2xpc3QuYmluZCh0aGlzKVxyXG4gICAgICAgIHRoaXMucmVtb3ZlID0gdGhpcy5yZW1vdmUuYmluZCh0aGlzKVxyXG4gICAgfVxyXG5cclxuICAgIHRvZ2dsZV9vdmVybGF5KCkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBzaG93X292ZXJsYXk6ICF0aGlzLnN0YXRlLnNob3dfb3ZlcmxheSB9KVxyXG4gICAgfVxyXG5cclxuICAgIGFkZCgpIHtcclxuICAgICAgICBsZXQgdmFsdWUgPSB0aGlzLnN0YXRlLm92ZXJsYXlfdmFsdWVcclxuICAgICAgICBsZXQgaXRlbXMgPSB0aGlzLnN0YXRlLml0ZW1zXHJcbiAgICAgICAgaWYgKHZhbHVlICYmICFpdGVtcy5pbmNsdWRlcyh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgICAgICAgICBpdGVtczogWy4uLml0ZW1zLCB2YWx1ZV0sXHJcbiAgICAgICAgICAgICAgICBvdmVybGF5X3ZhbHVlOiBcIlwiLFxyXG4gICAgICAgICAgICAgICAgc2hvd19vdmVybGF5OiBmYWxzZSxcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY2hlY2tfbGlzdChlKSB7XHJcbiAgICAgICAgbGV0IHZhbHVlID0gZS50YXJnZXQudmFsdWVcclxuICAgICAgICBsZXQgaXRlbXMgPSB0aGlzLnN0YXRlLml0ZW1zXHJcbiAgICAgICAgaWYgKHZhbHVlICYmICFpdGVtcy5pbmNsdWRlcyh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5vdmVybGF5X3ZhbHVlID0gdmFsdWVcclxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGVycm9yX21zZzogXCJcIiB9KVxyXG4gICAgICAgICAgICBpZiAoZS5rZXkgPT09IFwiRW50ZXJcIikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hZGQoKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGVycm9yX21zZzogXCJUaGF0IGVudHJ5IGFscmVhZHkgZXhpc3RzXCIgfSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlKGUpIHtcclxuICAgICAgICBsZXQgaXRlbSA9IGUudGFyZ2V0LmRhdGFzZXQubmFtZVxyXG4gICAgICAgIGxldCBpdGVtcyA9IHRoaXMuc3RhdGUuaXRlbXNcclxuICAgICAgICBpZiAoaXRlbXMuaW5jbHVkZXMoaXRlbSkpIHtcclxuICAgICAgICAgICAgaXRlbXMuc3BsaWNlKGl0ZW1zLmluZGV4T2YoaXRlbSksIDEpXHJcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgICAgICAgICAgaXRlbXM6IGl0ZW1zLFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgbGV0IHsgc2hvd19vdmVybGF5LCBvdmVybGF5X3ZhbHVlLCBlcnJvcl9tc2csIGl0ZW1zIH0gPSB0aGlzLnN0YXRlXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2xhYmVsJz5cclxuICAgICAgICAgICAgICAgIDxkaXY+e3RoaXMucHJvcHMubmFtZS50aXRsZSgpfTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9J2FkZF9idXR0b24nIG9uQ2xpY2s9e3RoaXMudG9nZ2xlX292ZXJsYXl9PlxyXG4gICAgICAgICAgICAgICAgICAgIEFkZFxyXG4gICAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nbGlzdCc+XHJcbiAgICAgICAgICAgICAgICAgICAge2l0ZW1zLm1hcChpdGVtID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDxMaXN0SXRlbSBrZXk9e2l0ZW19IG5hbWU9e2l0ZW19IHJlbW92ZT17dGhpcy5yZW1vdmV9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgfSl9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIHtzaG93X292ZXJsYXkgJiYgKFxyXG4gICAgICAgICAgICAgICAgICAgIDxPdmVybGF5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG92ZXJsYXlfdmFsdWU9e292ZXJsYXlfdmFsdWV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U9e3RoaXMucHJvcHMubmFtZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JfbXNnPXtlcnJvcl9tc2d9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvZ2dsZV9vdmVybGF5PXt0aGlzLnRvZ2dsZV9vdmVybGF5fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRfaXRlbT17dGhpcy5hZGR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrX2xpc3Q9e3RoaXMuY2hlY2tfbGlzdH1cclxuICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgSW5wdXQgZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcylcclxuICAgICAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICAgICAgICB2YWx1ZTogdGhpcy5wcm9wcy52YWx1ZSxcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy50b2dnbGVfY2hlY2tib3ggPSB0aGlzLnRvZ2dsZV9jaGVja2JveC5iaW5kKHRoaXMpXHJcbiAgICAgICAgdGhpcy5zZXRfdmFsdWUgPSB0aGlzLnNldF92YWx1ZS5iaW5kKHRoaXMpXHJcbiAgICB9XHJcblxyXG4gICAgdG9nZ2xlX2NoZWNrYm94KGUpIHtcclxuICAgICAgICBwcmludCghdGhpcy5zdGF0ZS52YWx1ZSlcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICAgICAgdmFsdWU6ICF0aGlzLnN0YXRlLnZhbHVlLFxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgc2V0X3ZhbHVlKGUpIHtcclxuICAgICAgICBsZXQgdGFyZ2V0ID0gZS50YXJnZXRcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICAgICAgdmFsdWU6IHRhcmdldC52YWx1ZSxcclxuICAgICAgICB9KVxyXG4gICAgICAgIHByaW50KHRhcmdldC52YWx1ZSlcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgbGV0IGlucHV0XHJcbiAgICAgICAgbGV0IHsgbmFtZSwgdHlwZSwgY29tbWVudCwgb3B0aW9ucywgY2hpbGRyZW4sIHZhbHVlIH0gPSB0aGlzLnByb3BzXHJcbiAgICAgICAgbGV0IG1lc3NhZ2UgPSBuYW1lLnJlcGxhY2VBbGwoXCJfXCIsIFwiIFwiKS50aXRsZSgpXHJcbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJjaGVja2JveFwiOlxyXG4gICAgICAgICAgICAgICAgaW5wdXQgPSAoXHJcbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT0nY2hlY2tib3hfbGFiZWwnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMudG9nZ2xlX2NoZWNrYm94fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLWNvbW1lbnQ9e2NvbW1lbnR9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgbmFtZT17bmFtZX0gdHlwZT0nY2hlY2tib3gnIHZhbHVlPXt2YWx1ZX0gLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSdjaGVja2JveF90aXRsZSc+e21lc3NhZ2V9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA/IFwiY2hlY2tib3hfY3VzdG9tIGNoZWNrZWRcIiA6IFwiY2hlY2tib3hfY3VzdG9tXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgY2FzZSBcInNlbGVjdFwiOlxyXG4gICAgICAgICAgICAgICAgaW5wdXQgPSAoXHJcbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGRhdGEtY29tbWVudD17Y29tbWVudH0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0naW5wdXRfdGl0bGUnPnttZXNzYWdlfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHNlbGVjdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZT17bmFtZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHRWYWx1ZT17dmFsdWV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5zZXRfdmFsdWV9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge29wdGlvbnMubWFwKChvcHRpb24sIGkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIGtleT17aX0gdmFsdWU9e29wdGlvbi52YWx1ZX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7b3B0aW9uLnRleHR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgY2FzZSBcImxpc3RcIjpcclxuICAgICAgICAgICAgICAgIGlucHV0ID0gPExpc3QgbmFtZT17bmFtZX0gdmFsdWU9e3ZhbHVlfSBzZXRfY29uZmlnPXt0aGlzLnNldF92YWx1ZX0gLz5cclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGNhc2UgXCJ0ZXh0XCI6XHJcbiAgICAgICAgICAgICAgICBpbnB1dCA9IChcclxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgZGF0YS1jb21tZW50PXtjb21tZW50fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSdpbnB1dF90aXRsZSc+e21lc3NhZ2V9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU9e25hbWV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0VmFsdWU9e3ZhbHVlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPSd0ZXh0J1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXV0b0NvbXBsZXRlPSdvZmYnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbktleVVwPXt0aGlzLnNldF92YWx1ZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgY2FzZSBcInBhcmVudFwiOlxyXG4gICAgICAgICAgICAgICAgaW5wdXQgPSAoXHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J3BhcmVudCc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+e21lc3NhZ2V9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtjaGlsZHJlbi5sZW5ndGggJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuLm1hcCgoY2hpbGQsIGkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gPElucHV0IGtleT17aX0gey4uLmNoaWxkfSAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSl9XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICBjYXNlIFwibnVtYmVyXCI6XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICBpbnB1dCA9IChcclxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgZGF0YS1jb21tZW50PXtjb21tZW50fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSdpbnB1dF90aXRsZSc+e21lc3NhZ2V9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU9e25hbWV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0VmFsdWU9e3ZhbHVlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT17dHlwZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLnNldF92YWx1ZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGlucHV0XHJcbiAgICB9XHJcbn1cclxuIl19