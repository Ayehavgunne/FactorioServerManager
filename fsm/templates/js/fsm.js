var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Header, Nav } from "./components";
import { section_mapper } from "./sections";

var wp = window.props;
var sections = ["status", "console", "mods", "config"];
var full_height = { height: "100%" };

var App = function (_Component) {
    _inherits(App, _Component);

    function App(props) {
        _classCallCheck(this, App);

        var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

        _this.change_game = _this.change_game.bind(_this);
        _this.change_section = _this.change_section.bind(_this);

        _this.state = {
            selected_game: window.props.selected_game,
            selected_section: sections[0]
        };
        return _this;
    }

    _createClass(App, [{
        key: "change_game",
        value: function change_game(e) {
            var target = enhance_element(e.target);
            this.setState({
                selected_game: target.val()
            });
        }
    }, {
        key: "change_section",
        value: function change_section(e) {
            var target = e.target;
            this.setState({
                selected_section: target.id.replace("_nav", "")
            });
        }
    }, {
        key: "render",
        value: function render() {
            var _state = this.state,
                selected_game = _state.selected_game,
                selected_section = _state.selected_section;

            var Section = section_mapper(this.state);

            return React.createElement(
                "div",
                { style: full_height },
                React.createElement(Header, {
                    username: wp["username"],
                    games: wp["games"],
                    selected: selected_game,
                    section: selected_section,
                    change_game: this.change_game
                }),
                React.createElement(Nav, {
                    navs: sections,
                    selected: selected_section,
                    change_section: this.change_section
                }),
                React.createElement(
                    "main",
                    null,
                    React.createElement(
                        "section",
                        null,
                        React.createElement(Section, null)
                    )
                )
            );
        }
    }]);

    return App;
}(Component);

export var fsm = function fsm() {
    ReactDOM.render(React.createElement(App, null), document.getElementById("app"));
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2pzeC9mc20uanN4Il0sIm5hbWVzIjpbIlJlYWN0IiwiQ29tcG9uZW50IiwiUmVhY3RET00iLCJIZWFkZXIiLCJOYXYiLCJzZWN0aW9uX21hcHBlciIsIndwIiwid2luZG93IiwicHJvcHMiLCJzZWN0aW9ucyIsImZ1bGxfaGVpZ2h0IiwiaGVpZ2h0IiwiQXBwIiwiY2hhbmdlX2dhbWUiLCJiaW5kIiwiY2hhbmdlX3NlY3Rpb24iLCJzdGF0ZSIsInNlbGVjdGVkX2dhbWUiLCJzZWxlY3RlZF9zZWN0aW9uIiwiZSIsInRhcmdldCIsImVuaGFuY2VfZWxlbWVudCIsInNldFN0YXRlIiwidmFsIiwiaWQiLCJyZXBsYWNlIiwiU2VjdGlvbiIsImZzbSIsInJlbmRlciIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsT0FBT0EsS0FBUCxJQUFnQkMsU0FBaEIsUUFBaUMsT0FBakM7QUFDQSxPQUFPQyxRQUFQLE1BQXFCLFdBQXJCO0FBQ0EsU0FBU0MsTUFBVCxFQUFpQkMsR0FBakIsUUFBNEIsY0FBNUI7QUFDQSxTQUFTQyxjQUFULFFBQStCLFlBQS9COztBQUVBLElBQU1DLEtBQUtDLE9BQU9DLEtBQWxCO0FBQ0EsSUFBTUMsV0FBVyxDQUFDLFFBQUQsRUFBVyxTQUFYLEVBQXNCLE1BQXRCLEVBQThCLFFBQTlCLENBQWpCO0FBQ0EsSUFBTUMsY0FBYyxFQUFFQyxRQUFRLE1BQVYsRUFBcEI7O0lBRU1DLEc7OztBQUNGLGlCQUFZSixLQUFaLEVBQW1CO0FBQUE7O0FBQUEsOEdBQ1RBLEtBRFM7O0FBR2YsY0FBS0ssV0FBTCxHQUFtQixNQUFLQSxXQUFMLENBQWlCQyxJQUFqQixPQUFuQjtBQUNBLGNBQUtDLGNBQUwsR0FBc0IsTUFBS0EsY0FBTCxDQUFvQkQsSUFBcEIsT0FBdEI7O0FBRUEsY0FBS0UsS0FBTCxHQUFhO0FBQ1RDLDJCQUFlVixPQUFPQyxLQUFQLENBQWFTLGFBRG5CO0FBRVRDLDhCQUFrQlQsU0FBUyxDQUFUO0FBRlQsU0FBYjtBQU5lO0FBVWxCOzs7O29DQUVXVSxDLEVBQUc7QUFDWCxnQkFBSUMsU0FBU0MsZ0JBQWdCRixFQUFFQyxNQUFsQixDQUFiO0FBQ0EsaUJBQUtFLFFBQUwsQ0FBYztBQUNWTCwrQkFBZUcsT0FBT0csR0FBUDtBQURMLGFBQWQ7QUFHSDs7O3VDQUVjSixDLEVBQUc7QUFDZCxnQkFBSUMsU0FBU0QsRUFBRUMsTUFBZjtBQUNBLGlCQUFLRSxRQUFMLENBQWM7QUFDVkosa0NBQWtCRSxPQUFPSSxFQUFQLENBQVVDLE9BQVYsQ0FBa0IsTUFBbEIsRUFBMEIsRUFBMUI7QUFEUixhQUFkO0FBR0g7OztpQ0FFUTtBQUFBLHlCQUNxQyxLQUFLVCxLQUQxQztBQUFBLGdCQUNDQyxhQURELFVBQ0NBLGFBREQ7QUFBQSxnQkFDZ0JDLGdCQURoQixVQUNnQkEsZ0JBRGhCOztBQUVMLGdCQUFJUSxVQUFVckIsZUFBZSxLQUFLVyxLQUFwQixDQUFkOztBQUVBLG1CQUNJO0FBQUE7QUFBQSxrQkFBSyxPQUFPTixXQUFaO0FBQ0ksb0NBQUMsTUFBRDtBQUNJLDhCQUFVSixHQUFHLFVBQUgsQ0FEZDtBQUVJLDJCQUFPQSxHQUFHLE9BQUgsQ0FGWDtBQUdJLDhCQUFVVyxhQUhkO0FBSUksNkJBQVNDLGdCQUpiO0FBS0ksaUNBQWEsS0FBS0w7QUFMdEIsa0JBREo7QUFRSSxvQ0FBQyxHQUFEO0FBQ0ksMEJBQU1KLFFBRFY7QUFFSSw4QkFBVVMsZ0JBRmQ7QUFHSSxvQ0FBZ0IsS0FBS0g7QUFIekIsa0JBUko7QUFhSTtBQUFBO0FBQUE7QUFDSTtBQUFBO0FBQUE7QUFDSSw0Q0FBQyxPQUFEO0FBREo7QUFESjtBQWJKLGFBREo7QUFxQkg7Ozs7RUFwRGFkLFM7O0FBdURsQixPQUFPLElBQUkwQixNQUFNLFNBQU5BLEdBQU0sR0FBTTtBQUNuQnpCLGFBQVMwQixNQUFULENBQWdCLG9CQUFDLEdBQUQsT0FBaEIsRUFBeUJDLFNBQVNDLGNBQVQsQ0FBd0IsS0FBeEIsQ0FBekI7QUFDSCxDQUZNIiwiZmlsZSI6ImZzbS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tIFwicmVhY3RcIlxyXG5pbXBvcnQgUmVhY3RET00gZnJvbSBcInJlYWN0LWRvbVwiXHJcbmltcG9ydCB7IEhlYWRlciwgTmF2IH0gZnJvbSBcIi4vY29tcG9uZW50c1wiXHJcbmltcG9ydCB7IHNlY3Rpb25fbWFwcGVyIH0gZnJvbSBcIi4vc2VjdGlvbnNcIlxyXG5cclxuY29uc3Qgd3AgPSB3aW5kb3cucHJvcHNcclxuY29uc3Qgc2VjdGlvbnMgPSBbXCJzdGF0dXNcIiwgXCJjb25zb2xlXCIsIFwibW9kc1wiLCBcImNvbmZpZ1wiXVxyXG5jb25zdCBmdWxsX2hlaWdodCA9IHsgaGVpZ2h0OiBcIjEwMCVcIiB9XHJcblxyXG5jbGFzcyBBcHAgZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcylcclxuXHJcbiAgICAgICAgdGhpcy5jaGFuZ2VfZ2FtZSA9IHRoaXMuY2hhbmdlX2dhbWUuYmluZCh0aGlzKVxyXG4gICAgICAgIHRoaXMuY2hhbmdlX3NlY3Rpb24gPSB0aGlzLmNoYW5nZV9zZWN0aW9uLmJpbmQodGhpcylcclxuXHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgICAgICAgc2VsZWN0ZWRfZ2FtZTogd2luZG93LnByb3BzLnNlbGVjdGVkX2dhbWUsXHJcbiAgICAgICAgICAgIHNlbGVjdGVkX3NlY3Rpb246IHNlY3Rpb25zWzBdLFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjaGFuZ2VfZ2FtZShlKSB7XHJcbiAgICAgICAgbGV0IHRhcmdldCA9IGVuaGFuY2VfZWxlbWVudChlLnRhcmdldClcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICAgICAgc2VsZWN0ZWRfZ2FtZTogdGFyZ2V0LnZhbCgpLFxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgY2hhbmdlX3NlY3Rpb24oZSkge1xyXG4gICAgICAgIGxldCB0YXJnZXQgPSBlLnRhcmdldFxyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgICAgICBzZWxlY3RlZF9zZWN0aW9uOiB0YXJnZXQuaWQucmVwbGFjZShcIl9uYXZcIiwgXCJcIiksXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgbGV0IHsgc2VsZWN0ZWRfZ2FtZSwgc2VsZWN0ZWRfc2VjdGlvbiB9ID0gdGhpcy5zdGF0ZVxyXG4gICAgICAgIGxldCBTZWN0aW9uID0gc2VjdGlvbl9tYXBwZXIodGhpcy5zdGF0ZSlcclxuICAgICAgICAvLyBwcmludCh0aGlzLnN0YXRlKVxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2Z1bGxfaGVpZ2h0fT5cclxuICAgICAgICAgICAgICAgIDxIZWFkZXJcclxuICAgICAgICAgICAgICAgICAgICB1c2VybmFtZT17d3BbXCJ1c2VybmFtZVwiXX1cclxuICAgICAgICAgICAgICAgICAgICBnYW1lcz17d3BbXCJnYW1lc1wiXX1cclxuICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZD17c2VsZWN0ZWRfZ2FtZX1cclxuICAgICAgICAgICAgICAgICAgICBzZWN0aW9uPXtzZWxlY3RlZF9zZWN0aW9ufVxyXG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZV9nYW1lPXt0aGlzLmNoYW5nZV9nYW1lfVxyXG4gICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgIDxOYXZcclxuICAgICAgICAgICAgICAgICAgICBuYXZzPXtzZWN0aW9uc31cclxuICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZD17c2VsZWN0ZWRfc2VjdGlvbn1cclxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2Vfc2VjdGlvbj17dGhpcy5jaGFuZ2Vfc2VjdGlvbn1cclxuICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICA8bWFpbj5cclxuICAgICAgICAgICAgICAgICAgICA8c2VjdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPFNlY3Rpb24gLz5cclxuICAgICAgICAgICAgICAgICAgICA8L3NlY3Rpb24+XHJcbiAgICAgICAgICAgICAgICA8L21haW4+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIClcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGxldCBmc20gPSAoKSA9PiB7XHJcbiAgICBSZWFjdERPTS5yZW5kZXIoPEFwcCAvPiwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhcHBcIikpXHJcbn1cclxuIl19