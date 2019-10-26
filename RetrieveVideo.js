const { ElvClient } = require("@eluvio/elv-client-js");

const Load = async () => {
        const configUrl = "https://demo.net955210.contentfabric.io/config";
        const client = await ElvClient.FromConfigurationUrl({configUrl});
        const wallet = client.GenerateWallet();
        const mnemonic = wallet.GenerateMnemonic();
        const signer = wallet.AddAccountFromMnemonic({mnemonic});
        await client.SetSigner({signer});
        const versionHash = "hq__B1WL1oJa9MCiRpWXBmaoHtAwQdgNGKU36vazGDjjg9e8xS7uQADLct8j5NByXG3qnNAVQ7DcTh";
        const availableDRMs = await client.AvailableDRMs();
        const playoutOptions = await client.PlayoutOptions({
          versionHash,
          protocols: ["dash", "hls"],
          drms: availableDRMs
        });