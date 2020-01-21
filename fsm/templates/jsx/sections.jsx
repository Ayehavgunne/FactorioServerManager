import React, { Component } from "react"
import WebSocket from "./websocket"
import { HistoryBar, Input } from "./components"
import { is_object, print } from "./util"

class Status extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selected_tab: "cpu",
            update_version: "",
            game_status: "",
            total_mem: "",
            total_mem_raw: "",
            version: "",
            cpu_text: "",
            mem_text: "",
            avail_mem_text: "",
            history: [],
        }

        this.get_game_version = this.get_game_version.bind(this)
        this.handle_data = this.handle_data.bind(this)
        this.change_chart_tab = this.change_chart_tab.bind(this)
    }

    get_game_version() {
        return fetch(`factorio/${this.props.selected_game}/get_current_version`).then(
            data => {
                return data.text()
            },
        )
    }

    change_chart_tab(e) {
        let target = e.target
        this.setState({
            selected_tab: target.id.replace("game_", "").replace("_tab", ""),
        })
    }

    componentDidMount() {
        this.get_game_version().then(data => {
            this.setState({
                version: data,
            })
        })
    }

    handle_data(data) {
        let result = JSON.parse(data)
        if (result) {
            this.setState({
                game_status: result[0]["status"].title(),
                total_mem: result[0]["total_mem"],
                total_mem_raw: result[0]["total_mem_raw"],
                cpu_text: result[0]["cpu"],
                mem_text: result[0]["mem"],
                avail_mem_text: result[0]["available_mem"],
                history: result,
            })
        } else {
            this.setState({
                game_status: "Stopped",
                total_mem_raw: "",
                cpu_text: "",
                mem_text: "",
                avail_mem_text: "",
            })
        }
    }

    static send_command(e) {
        let target = e.target
        fetch(target.dataset.url)
    }

    switch_chart() {
        let Chart
        let threshold = 2
        let total_mem = this.state.total_mem_raw
        switch (this.state.selected_tab) {
            case "cpu":
                Chart = () => (
                    <div id='game_cpu' className='chart_box'>
                        {this.state.history.map((item, i) => {
                            let cpu = item.cpu
                            if (cpu < threshold) {
                                cpu = threshold
                            }
                            return <HistoryBar height={cpu} key={i} num={i * 2} />
                        })}
                    </div>
                )
                break
            case "mem":
                Chart = () => (
                    <div id='game_mem' className='chart_box'>
                        {this.state.history.map((item, i) => {
                            let mem_percent = (item.mem_raw / total_mem) * 100
                            if (mem_percent < threshold) {
                                mem_percent = threshold
                            }
                            return (
                                <HistoryBar height={mem_percent} key={i} num={i * 2} />
                            )
                        })}
                    </div>
                )
                break
            case "available_mem":
                Chart = () => (
                    <div id='available_mem' className='chart_box'>
                        {this.state.history.map((item, i) => {
                            let mem_percent = (item.available_mem_raw / total_mem) * 100
                            if (mem_percent < threshold) {
                                mem_percent = threshold
                            }
                            return (
                                <HistoryBar height={mem_percent} key={i} num={i * 2} />
                            )
                        })}
                    </div>
                )
        }
        return Chart
    }

    render() {
        let {
            selected_tab,
            update_version,
            game_status,
            total_mem,
            version,
            cpu_text,
            mem_text,
            avail_mem_text,
        } = this.state
        let selected_game = this.props.selected_game
        let Chart = this.switch_chart()

        return (
            <React.Fragment>
                <div id='charts'>
                    <Chart />
                    <div
                        id='game_cpu_tab'
                        className={
                            selected_tab === "cpu"
                                ? "chart_tab selected_tab"
                                : "chart_tab"
                        }
                        onClick={this.change_chart_tab}>
                        CPU {cpu_text}
                        {cpu_text + "" ? "%" : ""}
                    </div>
                    <div
                        id='game_mem_tab'
                        className={
                            selected_tab === "mem"
                                ? "chart_tab selected_tab"
                                : "chart_tab"
                        }
                        onClick={this.change_chart_tab}>
                        Memory {mem_text}
                    </div>
                    <div
                        id='available_mem_tab'
                        className={
                            selected_tab === "available_mem"
                                ? "chart_tab selected_tab"
                                : "chart_tab"
                        }
                        onClick={this.change_chart_tab}>
                        Available Memory {avail_mem_text}
                    </div>
                </div>
                <div id='status_buttons'>
                    <button
                        className='action'
                        onClick={Status.send_command}
                        data-url={`factorio/${selected_game}/start`}>
                        Start {selected_game}
                    </button>
                    <button
                        className='action'
                        onClick={Status.send_command}
                        data-url={`factorio/${selected_game}/stop`}>
                        Stop {selected_game}
                    </button>
                    <button
                        className='action'
                        onClick={Status.send_command}
                        data-url={`factorio/${selected_game}/check_for_update`}>
                        Check for Updates
                    </button>
                    {update_version && (
                        <span>
                            Version {update_version} is available!
                            <button
                                id='get_update'
                                data-url={`factorio/${selected_game}/update?version=${version}`}>
                                Update Now
                            </button>
                        </span>
                    )}
                    <span className='stats'>Current Version: {version}</span>
                    <span className='stats'>Status: {game_status}</span>
                    <span className='stats'>Total System Memory: {total_mem}</span>
                </div>
                <WebSocket
                    url={`ws/factorio_status?name=${selected_game}`}
                    onMessage={this.handle_data}
                    onOpen={() => fetch("start_stream/factorio")}
                />
            </React.Fragment>
        )
    }
}

class Console extends Component {
    constructor(props) {
        super(props)

        this.state = {
            history: [],
        }

        this.handle_data = this.handle_data.bind(this)
    }

    handle_data(data) {
        let result = JSON.parse(data)
        if (result) {
            this.setState({ history: [...this.state.history, result] })
        }
    }

    render() {
        let { history } = this.state
        return (
            <div id='console_box'>
                {history.map((message, i) => {
                    return (
                        <div className='console_line' key={i}>
                            {message}
                        </div>
                    )
                })}
                <WebSocket
                    url={`ws/log_tail?name=${this.props.selected_game}`}
                    onMessage={this.handle_data}
                    onOpen={() => fetch("start_stream/log")}
                />
            </div>
        )
    }
}

const col_1 = [
    "afk_autokick_interval",
    "autosave_interval",
    "autosave_slots",
    "max_players",
    "max_upload_in_kilobytes_per_second",
    "minimum_latency_in_ticks",
    "description",
    "game_password",
    "name",
    "username",
    "password",
    "token",
    "allow_commands",
]
const col_2 = [
    "admins",
    "tags",
    "auto_pause",
    "autosave_only_on_server",
    "ignore_player_limit_for_returning_players",
    "only_admins_can_pause_the_game",
    "require_user_verification",
    "visibility",
]
const enums = {
    allow_commands: [
        { value: "true", text: "True" },
        { value: "false", text: "False" },
        { value: "admins-only", text: "Admins Only" },
    ],
}

let json_types = (name, obj, parent_comment) => {
    let value = obj[name]
    let comment = obj[`_comment_${name}`]
    if (parent_comment) {
        comment = parent_comment
    }
    if (typeof value !== "undefined") {
        if (Number.isInteger(value)) {
            return {
                name: name,
                value: value,
                type: "number",
                comment: comment,
            }
        } else if (typeof value === "string") {
            if (enums.hasOwnProperty(name)) {
                return {
                    name: name,
                    value: value,
                    options: enums[name],
                    type: "select",
                    comment: comment,
                }
            } else {
                return {
                    name: name,
                    value: value,
                    type: "text",
                    comment: comment,
                }
            }
        } else if (typeof value === "boolean") {
            return {
                name: name,
                value: value,
                type: "checkbox",
                comment: comment,
            }
        } else if (Array.isArray(value)) {
            return {
                name: name,
                value: value,
                type: "list",
                comment: comment,
            }
        } else if (is_object(value)) {
            let children = []
            let c
            for (let key of Object.keys(value)) {
                if (Array.isArray(comment)) {
                    for (c of comment) {
                        if (c.includes(key)) {
                            break
                        }
                    }
                }
                children.push(json_types(key, value, c))
            }
            return {
                name: name,
                children: children,
                comment: comment,
                type: "parent",
            }
        }
    }
}

class Configs extends Component {
    constructor(props) {
        super(props)

        this.state = {
            fields: {},
            values: {},
        }

        this.get_configs = this.get_configs.bind(this)
        this.send_configs = this.send_configs.bind(this)
        this.set_config = this.set_config.bind(this)
    }

    componentWillMount() {
        this.get_configs()
    }

    get_configs() {
        fetch(`factorio/${this.props.selected_game}/server_config`)
            .then(result => {
                return result.json()
            })
            .then(result => {
                let field_configs = Configs.process_configs(result)
                this.setState({ fields: field_configs })
            })
    }

    static process_configs(fields) {
        let field_configs = { col_1: [], col_2: [] }
        for (let name of col_1) {
            if (typeof fields[name] !== "undefined") {
                field_configs.col_1.push(json_types(name, fields))
            }
        }
        for (let name of col_2) {
            if (typeof fields[name] !== "undefined") {
                field_configs.col_2.push(json_types(name, fields))
            }
        }
        return field_configs
    }

    send_configs() {
        print(this.state.fields)
        print(this.state.values)
        // fetch(`factorio/${this.props.selected_game}/update_server_configs`, {
        //     method: "POST",
        //     body: JSON.stringify(this.state.fields),
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        //     credentials: "omit",
        // })
    }

    set_config() {
        let name, value
        let vals = Object.assign({}, this.state.values)
        vals[name] = value
        this.setState({
            values: vals,
        })
    }

    render() {
        let { fields } = this.state
        return (
            <div id='config_sec'>
                <div className='columns'>
                    {fields.col_1 && (
                        <div className='column'>
                            {fields.col_1.map(field => {
                                return (
                                    <Input
                                        key={field.name}
                                        {...field}
                                        // set_config={this.set_config}
                                        // ref={node =>
                                        //     (this.state.values[field.name] = node)
                                        // }
                                    />
                                )
                            })}
                        </div>
                    )}
                    {fields.col_2 && (
                        <div className='column'>
                            {fields.col_2.map(field => {
                                return (
                                    <Input
                                        key={field.name}
                                        {...field}
                                        // set_config={this.set_config}
                                        // ref={node =>
                                        //     (this.state.values[field.name] = node)
                                        // }
                                    />
                                )
                            })}
                        </div>
                    )}
                </div>
                <button id='save_server_config' onClick={this.send_configs}>
                    Save
                </button>
            </div>
        )
    }
}

export let section_mapper = props => {
    let Section
    switch (props.selected_section) {
        case "status":
            Section = () => <Status {...props} />
            break
        case "console":
            Section = () => <Console {...props} />
            break
        case "mods":
            Section = () => <div>TODO mods</div>
            break
        case "config":
            Section = () => <Configs {...props} />
            break
        default:
            Section = () => ""
    }
    return Section
}
