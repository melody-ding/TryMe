const { ElvClient } = require("@eluvio/elv-client-js");

var uploadVid = async () => {
	 const client = await ElvClient.FromConfigurationUrl({
	  configUrl: "https://demo.net955210.contentfabric.io/config"
	});

	const wallet =  client.GenerateWallet();
	const signer =  wallet.AddAccount({
	  privateKey: "0x6ea651114eb324fcc86c0e961039360caef4817e1e188da3a8e00443619e082f"
	});

	 client.SetSigner({signer});

	let libraryId = "ilibzbXVGkxaafqKy5GVsD4BMCER1QB";
	const createResponse = await client.CreateContentObject({libraryId});
	const objectId = createResponse.id;
	const writeToken = createResponse.write_token;

	await client.ReplaceMetadata({
	  libraryId,
	  objectId,
	  writeToken,
	  metadata: {
	    tags: [
	      "video",
	      "audio"
	    ]
	  }
	});

	var reader = new FileReader();
	let file = readAsDataURL();
	let data = await new Response(file).blob();

	await client.UploadFiles({
	  libraryId,
	  objectId,
	  writeToken,
	  fileInfo: [
	    {
	      path: "samples/bunny_video.mp4",
	      mime_type: "video/mp4",
	      size: 10000
	      
	    }
	  ]
	});

	const finalizeResponse = await client.FinalizeContentObject({
	  libraryId,
	  objectId,
	  writeToken
	});

	const versionHash = finalizeResponse.hash;
};

uploadVid();
