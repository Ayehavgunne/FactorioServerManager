var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from "react";

var Websocket = function (_React$Component) {
    _inherits(Websocket, _React$Component);

    function Websocket(props) {
        _classCallCheck(this, Websocket);

        var _this = _possibleConstructorReturn(this, (Websocket.__proto__ || Object.getPrototypeOf(Websocket)).call(this, props));

        var secure = _this.props.secure ? "s" : "";
        _this.state = {
            ws: new WebSocket("ws" + secure + "://" + _this.props.host + "/" + _this.props.url, _this.props.protocol),
            attempts: 1
        };

        _this.sendMessage = _this.sendMessage.bind(_this);
        _this.setupWebsocket = _this.setupWebsocket.bind(_this);
        return _this;
    }

    _createClass(Websocket, [{
        key: "logging",
        value: function logging(logline) {
            if (this.props.debug === true) {
                print(logline);
            }
        }
    }, {
        key: "generateInterval",
        value: function generateInterval(k) {
            if (this.props.reconnectIntervalInMilliSeconds > 0) {
                return this.props.reconnectIntervalInMilliSeconds;
            }
            return Math.min(30, Math.pow(2, k) - 1) * 1000;
        }
    }, {
        key: "setupWebsocket",
        value: function setupWebsocket() {
            var _this2 = this;

            var websocket = this.state.ws;

            websocket.onopen = function () {
                _this2.logging("Websocket connected");
                if (typeof _this2.props.onOpen === "function") _this2.props.onOpen();
            };

            websocket.onmessage = function (evt) {
                _this2.props.onMessage(evt.data);
            };

            this.shouldReconnect = this.props.reconnect;
            websocket.onclose = function () {
                _this2.logging("Websocket disconnected");
                if (typeof _this2.props.onClose === "function") _this2.props.onClose();
                if (_this2.shouldReconnect) {
                    var time = _this2.generateInterval(_this2.state.attempts);
                    _this2.timeoutID = setTimeout(function () {
                        _this2.setState({ attempts: _this2.state.attempts + 1 });
                        _this2.setState({
                            ws: new WebSocket(_this2.props.url, _this2.props.protocol)
                        });
                        _this2.setupWebsocket();
                    }, time);
                }
            };
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            this.setupWebsocket();
        }
    }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
            this.shouldReconnect = false;
            clearTimeout(this.timeoutID);
            this.state.ws.close();
        }
    }, {
        key: "sendMessage",
        value: function sendMessage(message) {
            var websocket = this.state.ws;
            websocket.send(message);
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement("span", null);
        }
    }]);

    return Websocket;
}(React.Component);

Websocket.defaultProps = {
    debug: false,
    reconnect: true,
    secure: false,
    host: window.location.host
};

export default Websocket;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2pzeC93ZWJzb2NrZXQuanN4Il0sIm5hbWVzIjpbIlJlYWN0IiwiV2Vic29ja2V0IiwicHJvcHMiLCJzZWN1cmUiLCJzdGF0ZSIsIndzIiwiV2ViU29ja2V0IiwiaG9zdCIsInVybCIsInByb3RvY29sIiwiYXR0ZW1wdHMiLCJzZW5kTWVzc2FnZSIsImJpbmQiLCJzZXR1cFdlYnNvY2tldCIsImxvZ2xpbmUiLCJkZWJ1ZyIsInByaW50IiwiayIsInJlY29ubmVjdEludGVydmFsSW5NaWxsaVNlY29uZHMiLCJNYXRoIiwibWluIiwicG93Iiwid2Vic29ja2V0Iiwib25vcGVuIiwibG9nZ2luZyIsIm9uT3BlbiIsIm9ubWVzc2FnZSIsIm9uTWVzc2FnZSIsImV2dCIsImRhdGEiLCJzaG91bGRSZWNvbm5lY3QiLCJyZWNvbm5lY3QiLCJvbmNsb3NlIiwib25DbG9zZSIsInRpbWUiLCJnZW5lcmF0ZUludGVydmFsIiwidGltZW91dElEIiwic2V0VGltZW91dCIsInNldFN0YXRlIiwiY2xlYXJUaW1lb3V0IiwiY2xvc2UiLCJtZXNzYWdlIiwic2VuZCIsIkNvbXBvbmVudCIsImRlZmF1bHRQcm9wcyIsIndpbmRvdyIsImxvY2F0aW9uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE9BQU9BLEtBQVAsTUFBa0IsT0FBbEI7O0lBRU1DLFM7OztBQUNGLHVCQUFZQyxLQUFaLEVBQW1CO0FBQUE7O0FBQUEsMEhBQ1RBLEtBRFM7O0FBRWYsWUFBSUMsU0FBUyxNQUFLRCxLQUFMLENBQVdDLE1BQVgsR0FBb0IsR0FBcEIsR0FBMEIsRUFBdkM7QUFDQSxjQUFLQyxLQUFMLEdBQWE7QUFDVEMsZ0JBQUksSUFBSUMsU0FBSixRQUNLSCxNQURMLFdBQ2lCLE1BQUtELEtBQUwsQ0FBV0ssSUFENUIsU0FDb0MsTUFBS0wsS0FBTCxDQUFXTSxHQUQvQyxFQUVBLE1BQUtOLEtBQUwsQ0FBV08sUUFGWCxDQURLO0FBS1RDLHNCQUFVO0FBTEQsU0FBYjs7QUFRQSxjQUFLQyxXQUFMLEdBQW1CLE1BQUtBLFdBQUwsQ0FBaUJDLElBQWpCLE9BQW5CO0FBQ0EsY0FBS0MsY0FBTCxHQUFzQixNQUFLQSxjQUFMLENBQW9CRCxJQUFwQixPQUF0QjtBQVplO0FBYWxCOzs7O2dDQUVPRSxPLEVBQVM7QUFDYixnQkFBSSxLQUFLWixLQUFMLENBQVdhLEtBQVgsS0FBcUIsSUFBekIsRUFBK0I7QUFDM0JDLHNCQUFNRixPQUFOO0FBQ0g7QUFDSjs7O3lDQUVnQkcsQyxFQUFHO0FBQ2hCLGdCQUFJLEtBQUtmLEtBQUwsQ0FBV2dCLCtCQUFYLEdBQTZDLENBQWpELEVBQW9EO0FBQ2hELHVCQUFPLEtBQUtoQixLQUFMLENBQVdnQiwrQkFBbEI7QUFDSDtBQUNELG1CQUFPQyxLQUFLQyxHQUFMLENBQVMsRUFBVCxFQUFhRCxLQUFLRSxHQUFMLENBQVMsQ0FBVCxFQUFZSixDQUFaLElBQWlCLENBQTlCLElBQW1DLElBQTFDO0FBQ0g7Ozt5Q0FFZ0I7QUFBQTs7QUFDYixnQkFBSUssWUFBWSxLQUFLbEIsS0FBTCxDQUFXQyxFQUEzQjs7QUFFQWlCLHNCQUFVQyxNQUFWLEdBQW1CLFlBQU07QUFDckIsdUJBQUtDLE9BQUwsQ0FBYSxxQkFBYjtBQUNBLG9CQUFJLE9BQU8sT0FBS3RCLEtBQUwsQ0FBV3VCLE1BQWxCLEtBQTZCLFVBQWpDLEVBQTZDLE9BQUt2QixLQUFMLENBQVd1QixNQUFYO0FBQ2hELGFBSEQ7O0FBS0FILHNCQUFVSSxTQUFWLEdBQXNCLGVBQU87QUFDekIsdUJBQUt4QixLQUFMLENBQVd5QixTQUFYLENBQXFCQyxJQUFJQyxJQUF6QjtBQUNILGFBRkQ7O0FBSUEsaUJBQUtDLGVBQUwsR0FBdUIsS0FBSzVCLEtBQUwsQ0FBVzZCLFNBQWxDO0FBQ0FULHNCQUFVVSxPQUFWLEdBQW9CLFlBQU07QUFDdEIsdUJBQUtSLE9BQUwsQ0FBYSx3QkFBYjtBQUNBLG9CQUFJLE9BQU8sT0FBS3RCLEtBQUwsQ0FBVytCLE9BQWxCLEtBQThCLFVBQWxDLEVBQThDLE9BQUsvQixLQUFMLENBQVcrQixPQUFYO0FBQzlDLG9CQUFJLE9BQUtILGVBQVQsRUFBMEI7QUFDdEIsd0JBQUlJLE9BQU8sT0FBS0MsZ0JBQUwsQ0FBc0IsT0FBSy9CLEtBQUwsQ0FBV00sUUFBakMsQ0FBWDtBQUNBLDJCQUFLMEIsU0FBTCxHQUFpQkMsV0FBVyxZQUFNO0FBQzlCLCtCQUFLQyxRQUFMLENBQWMsRUFBRTVCLFVBQVUsT0FBS04sS0FBTCxDQUFXTSxRQUFYLEdBQXNCLENBQWxDLEVBQWQ7QUFDQSwrQkFBSzRCLFFBQUwsQ0FBYztBQUNWakMsZ0NBQUksSUFBSUMsU0FBSixDQUFjLE9BQUtKLEtBQUwsQ0FBV00sR0FBekIsRUFBOEIsT0FBS04sS0FBTCxDQUFXTyxRQUF6QztBQURNLHlCQUFkO0FBR0EsK0JBQUtJLGNBQUw7QUFDSCxxQkFOZ0IsRUFNZHFCLElBTmMsQ0FBakI7QUFPSDtBQUNKLGFBYkQ7QUFjSDs7OzRDQUVtQjtBQUNoQixpQkFBS3JCLGNBQUw7QUFDSDs7OytDQUVzQjtBQUNuQixpQkFBS2lCLGVBQUwsR0FBdUIsS0FBdkI7QUFDQVMseUJBQWEsS0FBS0gsU0FBbEI7QUFDQSxpQkFBS2hDLEtBQUwsQ0FBV0MsRUFBWCxDQUFjbUMsS0FBZDtBQUNIOzs7b0NBRVdDLE8sRUFBUztBQUNqQixnQkFBSW5CLFlBQVksS0FBS2xCLEtBQUwsQ0FBV0MsRUFBM0I7QUFDQWlCLHNCQUFVb0IsSUFBVixDQUFlRCxPQUFmO0FBQ0g7OztpQ0FFUTtBQUNMLG1CQUFPLGlDQUFQO0FBQ0g7Ozs7RUEzRW1CekMsTUFBTTJDLFM7O0FBOEU5QjFDLFVBQVUyQyxZQUFWLEdBQXlCO0FBQ3JCN0IsV0FBTyxLQURjO0FBRXJCZ0IsZUFBVyxJQUZVO0FBR3JCNUIsWUFBUSxLQUhhO0FBSXJCSSxVQUFNc0MsT0FBT0MsUUFBUCxDQUFnQnZDO0FBSkQsQ0FBekI7O0FBT0EsZUFBZU4sU0FBZiIsImZpbGUiOiJ3ZWJzb2NrZXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCJcclxuXHJcbmNsYXNzIFdlYnNvY2tldCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKVxyXG4gICAgICAgIGxldCBzZWN1cmUgPSB0aGlzLnByb3BzLnNlY3VyZSA/IFwic1wiIDogXCJcIlxyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgICAgICAgIHdzOiBuZXcgV2ViU29ja2V0KFxyXG4gICAgICAgICAgICAgICAgYHdzJHtzZWN1cmV9Oi8vJHt0aGlzLnByb3BzLmhvc3R9LyR7dGhpcy5wcm9wcy51cmx9YCxcclxuICAgICAgICAgICAgICAgIHRoaXMucHJvcHMucHJvdG9jb2wsXHJcbiAgICAgICAgICAgICksXHJcbiAgICAgICAgICAgIGF0dGVtcHRzOiAxLFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5zZW5kTWVzc2FnZSA9IHRoaXMuc2VuZE1lc3NhZ2UuYmluZCh0aGlzKVxyXG4gICAgICAgIHRoaXMuc2V0dXBXZWJzb2NrZXQgPSB0aGlzLnNldHVwV2Vic29ja2V0LmJpbmQodGhpcylcclxuICAgIH1cclxuXHJcbiAgICBsb2dnaW5nKGxvZ2xpbmUpIHtcclxuICAgICAgICBpZiAodGhpcy5wcm9wcy5kZWJ1ZyA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICBwcmludChsb2dsaW5lKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZW5lcmF0ZUludGVydmFsKGspIHtcclxuICAgICAgICBpZiAodGhpcy5wcm9wcy5yZWNvbm5lY3RJbnRlcnZhbEluTWlsbGlTZWNvbmRzID4gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9wcy5yZWNvbm5lY3RJbnRlcnZhbEluTWlsbGlTZWNvbmRzXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBNYXRoLm1pbigzMCwgTWF0aC5wb3coMiwgaykgLSAxKSAqIDEwMDBcclxuICAgIH1cclxuXHJcbiAgICBzZXR1cFdlYnNvY2tldCgpIHtcclxuICAgICAgICBsZXQgd2Vic29ja2V0ID0gdGhpcy5zdGF0ZS53c1xyXG5cclxuICAgICAgICB3ZWJzb2NrZXQub25vcGVuID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dpbmcoXCJXZWJzb2NrZXQgY29ubmVjdGVkXCIpXHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5wcm9wcy5vbk9wZW4gPT09IFwiZnVuY3Rpb25cIikgdGhpcy5wcm9wcy5vbk9wZW4oKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgd2Vic29ja2V0Lm9ubWVzc2FnZSA9IGV2dCA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucHJvcHMub25NZXNzYWdlKGV2dC5kYXRhKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5zaG91bGRSZWNvbm5lY3QgPSB0aGlzLnByb3BzLnJlY29ubmVjdFxyXG4gICAgICAgIHdlYnNvY2tldC5vbmNsb3NlID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dpbmcoXCJXZWJzb2NrZXQgZGlzY29ubmVjdGVkXCIpXHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5wcm9wcy5vbkNsb3NlID09PSBcImZ1bmN0aW9uXCIpIHRoaXMucHJvcHMub25DbG9zZSgpXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnNob3VsZFJlY29ubmVjdCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHRpbWUgPSB0aGlzLmdlbmVyYXRlSW50ZXJ2YWwodGhpcy5zdGF0ZS5hdHRlbXB0cylcclxuICAgICAgICAgICAgICAgIHRoaXMudGltZW91dElEID0gc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGF0dGVtcHRzOiB0aGlzLnN0YXRlLmF0dGVtcHRzICsgMSB9KVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3czogbmV3IFdlYlNvY2tldCh0aGlzLnByb3BzLnVybCwgdGhpcy5wcm9wcy5wcm90b2NvbCksXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldHVwV2Vic29ja2V0KClcclxuICAgICAgICAgICAgICAgIH0sIHRpbWUpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XHJcbiAgICAgICAgdGhpcy5zZXR1cFdlYnNvY2tldCgpXHJcbiAgICB9XHJcblxyXG4gICAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XHJcbiAgICAgICAgdGhpcy5zaG91bGRSZWNvbm5lY3QgPSBmYWxzZVxyXG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXRJRClcclxuICAgICAgICB0aGlzLnN0YXRlLndzLmNsb3NlKClcclxuICAgIH1cclxuXHJcbiAgICBzZW5kTWVzc2FnZShtZXNzYWdlKSB7XHJcbiAgICAgICAgbGV0IHdlYnNvY2tldCA9IHRoaXMuc3RhdGUud3NcclxuICAgICAgICB3ZWJzb2NrZXQuc2VuZChtZXNzYWdlKVxyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICByZXR1cm4gPHNwYW4gLz5cclxuICAgIH1cclxufVxyXG5cclxuV2Vic29ja2V0LmRlZmF1bHRQcm9wcyA9IHtcclxuICAgIGRlYnVnOiBmYWxzZSxcclxuICAgIHJlY29ubmVjdDogdHJ1ZSxcclxuICAgIHNlY3VyZTogZmFsc2UsXHJcbiAgICBob3N0OiB3aW5kb3cubG9jYXRpb24uaG9zdCxcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgV2Vic29ja2V0XHJcbiJdfQ==