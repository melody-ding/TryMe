const { ElvClient } = require("@eluvio/elv-client-js");

const Load = async () => {
        const configUrl = "https://demo.net955210.contentfabric.io/config";
        const client = await ElvClient.FromConfigurationUrl({configUrl});
        const wallet = client.GenerateWallet();
        const mnemonic = wallet.GenerateMnemonic();
        const signer =  wallet.AddAccount({
          privateKey: "0x6ea651114eb324fcc86c0e961039360caef4817e1e188da3a8e00443619e082f"
        });
      
        client.SetSigner({signer});
        // Play the latest version of the content
        const objectId = "iq__3MRbyPWE1EwEnPb2uNgVPHgF57Qj";

        const playoutOptions = await client.PlayoutOptions({
          objectId,
          protocols: ["dash", "hls"],
          drms: availableDRMs 
        });
      }