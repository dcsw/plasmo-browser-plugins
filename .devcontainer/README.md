This is a [Plasmo extension](https://docs.plasmo.com/) project bootstrapped with [`plasmo init`](https://www.npmjs.com/package/plasmo).

## Getting Started

### Setup
This project depends on scaffolding created by plasma, and the example here was created using the following:

First update pnpm on your host:

```
npm upgrade -g pnpm
```

Then scaffold a new plasma project (note that at the time of this writing, the excellent typescript devcontainer provided by Microsoft, mcr.microsoft.com/devcontainers/typescript-node:1-20-bullseye, requires a pnpm upgrade to succeed):

```
pnpm create plasma --with-messaging webtext-grabber
```

Follow the prompts until the downloads start. Then get a cup of coffee while this completes.


### Note for pub-sub example

To test the externally connectable API (pub-sub):

1. Optional: Configure a second-level domain via your host file. This example uses the config below:

```
localhost localhost.com
```

2. Mandatory for tab messaging: Add an `.env` file containing the extension ID (see `example.env`)
3. Follow the development server step
4. Navigate to `https://localhost.com:1947/client-hub-a` to test out the API.

Use the page in 4 in chrome to open tab B. Then open the debugger (inspector) on each tab, and send messages from one to the other. Observe these showing up as new messages in each console.

### Development server

First, run the development server:

```bash
yarn next telemetry disable # disable "phone home" data
yarn dev # start things up!
```

Open your browser and load the appropriate development build. For example, if you are developing for the chrome browser, using manifest v3, use: `build/chrome-mv3-dev`.

You can start editing the popup by modifying `popup.tsx`. It should auto-update as you make changes. To add an options page, simply add a `options.tsx` file to the root of the project, with a react component default exported. Likewise to add a content page, add a `content.ts` file to the root of the project, importing some module and do some logic, then reload the extension on your browser.

For further guidance, [visit our Documentation](https://docs.plasmo.com/)

## Making production build

Run the following:

```bash
yarn next telemetry disable
yarn build
```

This should create a production bundle for your extension, ready to be zipped and published to the stores.

## Submit to the webstores

The easiest way to deploy your Plasmo extension is to use the built-in [bpp](https://bpp.browser.market) GitHub action. Prior to using this action however, make sure to build your extension and upload the first version to the store to establish the basic credentials. Then, simply follow [this setup instruction](https://docs.plasmo.com/framework/workflows/submit) and you should be on your way for automated submission!
