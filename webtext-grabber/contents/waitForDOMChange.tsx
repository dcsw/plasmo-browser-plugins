export const waitForDOMUpdate = async (req, res) => {
    try {
        const mutations = await waitForDOMUpdateX()
        res.send(JSON.stringify({ success: true }))
    } catch (error) {
        res.send(JSON.stringify(error))
    }
}

async function waitForDOMUpdateX(targetNode = document.body, config = { childList: true, subtree: true }): Promise<MutationRecord[]> {
    return new Promise((resolve) => {
        const observer = new MutationObserver((mutations, observer) => {
            observer.disconnect();
            resolve(mutations);
        });

        observer.observe(targetNode, config);

        setTimeout(() => {
            observer.disconnect();
            resolve([]);
        }, 5000);
    });
}
