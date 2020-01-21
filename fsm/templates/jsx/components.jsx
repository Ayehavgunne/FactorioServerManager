import React, { Component } from "react"

export const Header = ({ username, games, selected, section, change_game }) => (
    <header>
        <div id='greeting'>Hello {username}!</div>
        <label id='selected_game_label'>
            Current Game
            <select id='selected_game' value={selected} onChange={change_game}>
                {games.map((game, i) => {
                    return <option key={i}>{game}</option>
                })}
            </select>
        </label>
        <form id='logout_form' method='post' action='/auth/logout'>
            <input id='logout_button' type='submit' value='Log Out' />
        </form>
        <button id='restart_fsm' data-url='restart_server'>
            Restart FSM
        </button>
        <div id='title'>
            Factorio <span id='title_label'>{section.title()}</span>
        </div>
    </header>
)

export const Nav = ({ navs, selected, change_section }) => (
    <nav>
        <ul id='nav_links'>
            {navs.map((nav, i) => {
                return (
                    <li
                        id={nav + "_nav"}
                        key={i}
                        className={nav === selected ? "selected_nav" : ""}
                        onClick={change_section}>
                        {nav.title()}
                    </li>
                )
            })}
        </ul>
    </nav>
)

// export const SendButton = ({ text, url, on_click }) => (
//     <button data-url={url} onClick={on_click}>
//         {text}
//     </button>
// )

export const HistoryBar = ({ height, num }) => (
    <div
        style={{ height: `${height}%`, left: `calc(${num}% + 5px)` }}
        className='history_bar'
    />
)

class Overlay extends Component {
    constructor(props) {
        super(props)
        this.handleClick = this.handleClick.bind(this)
    }

    componentDidMount() {
        this.input.focus()
    }

    handleClick(e) {
        if (!this.node.contains(e.target)) {
            this.props.toggle_overlay()
        }
    }

    render() {
        let { overlay_value, message, error_msg, add_item, check_list } = this.props
        return (
            <div id='overlay' onClick={this.handleClick}>
                <div id='overlay_cell'>
                    <div id='overlay_msg' ref={node => (this.node = node)}>
                        {error_msg && <div id='error'>{error_msg}</div>}
                        <div>{message.title()} Entry</div>
                        <input
                            defaultValue={overlay_value}
                            onChange={check_list}
                            onKeyUp={check_list}
                            ref={node => (this.input = node)}
                        />
                        <button onClick={add_item}>Enter</button>
                    </div>
                </div>
            </div>
        )
    }
}

const ListItem = ({ name, remove }) => (
    <div className='list_item'>
        {name}
        <div className='remove' title='Remove' data-name={name} onClick={remove}>
            &times;
        </div>
    </div>
)

export class List extends Component {
    constructor(props) {
        super(props)
        this.state = {
            items: this.props.value,
            show_overlay: false,
            overlay_value: "",
            error_msg: "",
        }
        this.toggle_overlay = this.toggle_overlay.bind(this)
        this.add = this.add.bind(this)
        this.check_list = this.check_list.bind(this)
        this.remove = this.remove.bind(this)
    }

    toggle_overlay() {
        this.setState({ show_overlay: !this.state.show_overlay })
    }

    add() {
        let value = this.state.overlay_value
        let items = this.state.items
        if (value && !items.includes(value)) {
            this.setState({
                items: [...items, value],
                overlay_value: "",
                show_overlay: false,
            })
        }
    }

    check_list(e) {
        let value = e.target.value
        let items = this.state.items
        if (value && !items.includes(value)) {
            this.state.overlay_value = value
            this.setState({ error_msg: "" })
            if (e.key === "Enter") {
                this.add()
            }
        } else {
            this.setState({ error_msg: "That entry already exists" })
        }
    }

    remove(e) {
        let item = e.target.dataset.name
        let items = this.state.items
        if (items.includes(item)) {
            items.splice(items.indexOf(item), 1)
            this.setState({
                items: items,
            })
        }
    }

    render() {
        let { show_overlay, overlay_value, error_msg, items } = this.state
        return (
            <div className='label'>
                <div>{this.props.name.title()}</div>
                <button className='add_button' onClick={this.toggle_overlay}>
                    Add
                </button>
                <div className='list'>
                    {items.map(item => {
                        return <ListItem key={item} name={item} remove={this.remove} />
                    })}
                </div>
                {show_overlay && (
                    <Overlay
                        overlay_value={overlay_value}
                        message={this.props.name}
                        error_msg={error_msg}
                        toggle_overlay={this.toggle_overlay}
                        add_item={this.add}
                        check_list={this.check_list}
                    />
                )}
            </div>
        )
    }
}

export class Input extends Component {
    constructor(props) {
        super(props)
        this.state = {
            value: this.props.value,
        }
        this.toggle_checkbox = this.toggle_checkbox.bind(this)
        this.set_value = this.set_value.bind(this)
    }

    toggle_checkbox(e) {
        print(!this.state.value)
        e.preventDefault()
        this.setState({
            value: !this.state.value,
        })
    }

    set_value(e) {
        let target = e.target
        this.setState({
            value: target.value,
        })
        print(target.value)
    }

    render() {
        let input
        let { name, type, comment, options, children, value } = this.props
        let message = name.replaceAll("_", " ").title()
        switch (type) {
            case "checkbox":
                input = (
                    <label
                        className='checkbox_label'
                        onClick={this.toggle_checkbox}
                        data-comment={comment}>
                        <input name={name} type='checkbox' value={value} />
                        <span className='checkbox_title'>{message}</span>
                        <span
                            className={
                                value ? "checkbox_custom checked" : "checkbox_custom"
                            }
                        />
                    </label>
                )
                break
            case "select":
                input = (
                    <label data-comment={comment}>
                        <span className='input_title'>{message}</span>
                        <select
                            name={name}
                            defaultValue={value}
                            onChange={this.set_value}>
                            {options.map((option, i) => {
                                return (
                                    <option key={i} value={option.value}>
                                        {option.text}
                                    </option>
                                )
                            })}
                        </select>
                    </label>
                )
                break
            case "list":
                input = <List name={name} value={value} set_config={this.set_value} />
                break
            case "text":
                input = (
                    <label data-comment={comment}>
                        <span className='input_title'>{message}</span>
                        <input
                            name={name}
                            defaultValue={value}
                            className='text'
                            autoComplete='off'
                            onKeyUp={this.set_value}
                        />
                    </label>
                )
                break
            case "parent":
                input = (
                    <div className='parent'>
                        <div>{message}</div>
                        {children.length &&
                            children.map((child, i) => {
                                return <Input key={i} {...child} />
                            })}
                    </div>
                )
                break
            case "number":
            default:
                input = (
                    <label data-comment={comment}>
                        <span className='input_title'>{message}</span>
                        <input
                            name={name}
                            defaultValue={value}
                            type={type}
                            onChange={this.set_value}
                        />
                    </label>
                )
        }

        return input
    }
}
