import { ElvClient } from "elv-client-js/dist/ElvClient-node-min.js";
const { ElvClient } = require("elv-client-js/dist/ElvClient-node-min.js");

const client = ElvClient.FromConfigurationUrl({
  configUrl: "https://main.net955304.contentfabric.io/config"
});

const wallet = client.GenerateWallet();
const signer = wallet.AddAccount({
  privateKey: "0x6ea651114eb324fcc86c0e961039360caef4817e1e188da3a8e00443619e082f"
});

client.SetSigner({signer});