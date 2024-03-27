import React from "react"
import { useStorage } from "@plasmohq/storage/hook"
const { displayName: name, version, author, dependencies, description } = require("../package.json");

function OptionsIndex() {
    const [openAIKey, setOpenAIKey] = useStorage<string>("openAIKey")

    return (
        <div>
            <h1>
                {name} Settings
            </h1>
            <h2>Settings for {name} version {version}</h2>
            <label>OpenAI Key</label>
            <input title="OpenAI Key" onChange={(e) => setOpenAIKey(e.target.value)} value={openAIKey || ''} />
        </div>
    )
}

export default OptionsIndex