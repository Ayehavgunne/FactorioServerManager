import React, { Component } from "react"
import ReactDOM from "react-dom"
import { Header, Nav } from "./components"
import { section_mapper } from "./sections"

const wp = window.props
const sections = ["status", "console", "mods", "config"]
const full_height = { height: "100%" }

class App extends Component {
    constructor(props) {
        super(props)

        this.change_game = this.change_game.bind(this)
        this.change_section = this.change_section.bind(this)

        this.state = {
            selected_game: window.props.selected_game,
            selected_section: sections[0],
        }
    }

    change_game(e) {
        let target = enhance_element(e.target)
        this.setState({
            selected_game: target.val(),
        })
    }

    change_section(e) {
        let target = e.target
        this.setState({
            selected_section: target.id.replace("_nav", ""),
        })
    }

    render() {
        let { selected_game, selected_section } = this.state
        let Section = section_mapper(this.state)
        // print(this.state)
        return (
            <div style={full_height}>
                <Header
                    username={wp["username"]}
                    games={wp["games"]}
                    selected={selected_game}
                    section={selected_section}
                    change_game={this.change_game}
                />
                <Nav
                    navs={sections}
                    selected={selected_section}
                    change_section={this.change_section}
                />
                <main>
                    <section>
                        <Section />
                    </section>
                </main>
            </div>
        )
    }
}

export let fsm = () => {
    ReactDOM.render(<App />, document.getElementById("app"))
}
