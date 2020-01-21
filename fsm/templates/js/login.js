import React from "react";
import ReactDOM from "react-dom";

var props = window.props;

var Title = function Title() {
    return React.createElement(
        "div",
        { id: "welcome", key: "title" },
        "Welcome to FSM (The Factorio Server Manager)"
    );
};

var LoginForm = function LoginForm(_ref) {
    var msg = _ref.msg,
        username = _ref.username;
    return React.createElement(
        "form",
        { id: "login_form", method: "post", action: "/auth/login", key: "form" },
        React.createElement(
            "div",
            { id: "login_msg" },
            msg
        ),
        React.createElement(
            "label",
            null,
            "Username",
            " ",
            React.createElement("input", { id: "username", type: "text", name: "username", defaultValue: username })
        ),
        React.createElement(
            "label",
            null,
            "Password ",
            React.createElement("input", { id: "password", type: "password", name: "password" })
        ),
        React.createElement("input", { id: "login_button", type: "submit", value: "Log in" })
    );
};

var App = function App() {
    return React.createElement(
        "div",
        null,
        React.createElement(Title, null),
        React.createElement(LoginForm, { msg: props.message, username: props.username })
    );
};

export var login = function login() {
    ReactDOM.render(React.createElement(App, null), document.getElementById("app"));
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2pzeC9sb2dpbi5qc3giXSwibmFtZXMiOlsiUmVhY3QiLCJSZWFjdERPTSIsInByb3BzIiwid2luZG93IiwiVGl0bGUiLCJMb2dpbkZvcm0iLCJtc2ciLCJ1c2VybmFtZSIsIkFwcCIsIm1lc3NhZ2UiLCJsb2dpbiIsInJlbmRlciIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiXSwibWFwcGluZ3MiOiJBQUFBLE9BQU9BLEtBQVAsTUFBa0IsT0FBbEI7QUFDQSxPQUFPQyxRQUFQLE1BQXFCLFdBQXJCOztBQUVBLElBQU1DLFFBQVFDLE9BQU9ELEtBQXJCOztBQUVBLElBQU1FLFFBQVEsU0FBUkEsS0FBUTtBQUFBLFdBQ1Y7QUFBQTtBQUFBLFVBQUssSUFBRyxTQUFSLEVBQWtCLEtBQUksT0FBdEI7QUFBQTtBQUFBLEtBRFU7QUFBQSxDQUFkOztBQU1BLElBQU1DLFlBQVksU0FBWkEsU0FBWTtBQUFBLFFBQUdDLEdBQUgsUUFBR0EsR0FBSDtBQUFBLFFBQVFDLFFBQVIsUUFBUUEsUUFBUjtBQUFBLFdBQ2Q7QUFBQTtBQUFBLFVBQU0sSUFBRyxZQUFULEVBQXNCLFFBQU8sTUFBN0IsRUFBb0MsUUFBTyxhQUEzQyxFQUF5RCxLQUFJLE1BQTdEO0FBQ0k7QUFBQTtBQUFBLGNBQUssSUFBRyxXQUFSO0FBQXFCRDtBQUFyQixTQURKO0FBRUk7QUFBQTtBQUFBO0FBQUE7QUFDYSxlQURiO0FBRUksMkNBQU8sSUFBRyxVQUFWLEVBQXFCLE1BQUssTUFBMUIsRUFBaUMsTUFBSyxVQUF0QyxFQUFpRCxjQUFjQyxRQUEvRDtBQUZKLFNBRko7QUFNSTtBQUFBO0FBQUE7QUFBQTtBQUNhLDJDQUFPLElBQUcsVUFBVixFQUFxQixNQUFLLFVBQTFCLEVBQXFDLE1BQUssVUFBMUM7QUFEYixTQU5KO0FBU0ksdUNBQU8sSUFBRyxjQUFWLEVBQXlCLE1BQUssUUFBOUIsRUFBdUMsT0FBTSxRQUE3QztBQVRKLEtBRGM7QUFBQSxDQUFsQjs7QUFjQSxJQUFNQyxNQUFNLFNBQU5BLEdBQU07QUFBQSxXQUNSO0FBQUE7QUFBQTtBQUNJLDRCQUFDLEtBQUQsT0FESjtBQUVJLDRCQUFDLFNBQUQsSUFBVyxLQUFLTixNQUFNTyxPQUF0QixFQUErQixVQUFVUCxNQUFNSyxRQUEvQztBQUZKLEtBRFE7QUFBQSxDQUFaOztBQU9BLE9BQU8sSUFBSUcsUUFBUSxTQUFSQSxLQUFRLEdBQU07QUFDckJULGFBQVNVLE1BQVQsQ0FBZ0Isb0JBQUMsR0FBRCxPQUFoQixFQUF5QkMsU0FBU0MsY0FBVCxDQUF3QixLQUF4QixDQUF6QjtBQUNILENBRk0iLCJmaWxlIjoibG9naW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCJcclxuaW1wb3J0IFJlYWN0RE9NIGZyb20gXCJyZWFjdC1kb21cIlxyXG5cclxuY29uc3QgcHJvcHMgPSB3aW5kb3cucHJvcHNcclxuXHJcbmNvbnN0IFRpdGxlID0gKCkgPT4gKFxyXG4gICAgPGRpdiBpZD0nd2VsY29tZScga2V5PSd0aXRsZSc+XHJcbiAgICAgICAgV2VsY29tZSB0byBGU00gKFRoZSBGYWN0b3JpbyBTZXJ2ZXIgTWFuYWdlcilcclxuICAgIDwvZGl2PlxyXG4pXHJcblxyXG5jb25zdCBMb2dpbkZvcm0gPSAoeyBtc2csIHVzZXJuYW1lIH0pID0+IChcclxuICAgIDxmb3JtIGlkPSdsb2dpbl9mb3JtJyBtZXRob2Q9J3Bvc3QnIGFjdGlvbj0nL2F1dGgvbG9naW4nIGtleT0nZm9ybSc+XHJcbiAgICAgICAgPGRpdiBpZD0nbG9naW5fbXNnJz57bXNnfTwvZGl2PlxyXG4gICAgICAgIDxsYWJlbD5cclxuICAgICAgICAgICAgVXNlcm5hbWV7XCIgXCJ9XHJcbiAgICAgICAgICAgIDxpbnB1dCBpZD0ndXNlcm5hbWUnIHR5cGU9J3RleHQnIG5hbWU9J3VzZXJuYW1lJyBkZWZhdWx0VmFsdWU9e3VzZXJuYW1lfSAvPlxyXG4gICAgICAgIDwvbGFiZWw+XHJcbiAgICAgICAgPGxhYmVsPlxyXG4gICAgICAgICAgICBQYXNzd29yZCA8aW5wdXQgaWQ9J3Bhc3N3b3JkJyB0eXBlPSdwYXNzd29yZCcgbmFtZT0ncGFzc3dvcmQnIC8+XHJcbiAgICAgICAgPC9sYWJlbD5cclxuICAgICAgICA8aW5wdXQgaWQ9J2xvZ2luX2J1dHRvbicgdHlwZT0nc3VibWl0JyB2YWx1ZT0nTG9nIGluJyAvPlxyXG4gICAgPC9mb3JtPlxyXG4pXHJcblxyXG5jb25zdCBBcHAgPSAoKSA9PiAoXHJcbiAgICA8ZGl2PlxyXG4gICAgICAgIDxUaXRsZSAvPlxyXG4gICAgICAgIDxMb2dpbkZvcm0gbXNnPXtwcm9wcy5tZXNzYWdlfSB1c2VybmFtZT17cHJvcHMudXNlcm5hbWV9IC8+XHJcbiAgICA8L2Rpdj5cclxuKVxyXG5cclxuZXhwb3J0IGxldCBsb2dpbiA9ICgpID0+IHtcclxuICAgIFJlYWN0RE9NLnJlbmRlcig8QXBwIC8+LCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFwcFwiKSlcclxufVxyXG4iXX0=