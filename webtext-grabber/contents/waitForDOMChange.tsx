export const waitForDOMUpdate = async (req, res) => {
    try {
        const el = req.body.sel || document.documentElement;
        const mutations = await waitForDOMUpdateX(el)
        res.send(JSON.stringify({ success: true }))
    } catch (error) {
        res.send(JSON.stringify(error))
    }
}

async function waitForDOMUpdateX(targetNode = document.documentElement, config = { childList: true, subtree: true }): Promise<MutationRecord[]> {
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
export default waitForDOMUpdate