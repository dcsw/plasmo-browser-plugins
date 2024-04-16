import React from "react"
import { useStorage } from "@plasmohq/storage/hook"
const { displayName: name, version, author, dependencies, description } = require("../package.json");
import "../styles.css"

function OptionsIndex() {
    const [openAIKey, setOpenAIKey] = useStorage<string>("openAIKey")

    return (
        <div className="card"> 
            <div className="card-body">
                <h2 className="card-title">Settings for {name} version {version}</h2>
                <label>OpenAI</label>
                <label className="input input-bordered flex items-center gap-2">
                    OpenAI Key
                    <input type="text" className="grow" placeholder="OpenAI Key" onChange={(e) => setOpenAIKey(e.target.value)} value={openAIKey || ''} />
                </label>
            </div>
        </div>
    )
}

export default OptionsIndex