export async function POST(req: Request) {
    try {
      const form = await req.formData()
      var myHeaders = new Headers();
      const deployment = form.get('deployment')
      myHeaders.append("azureml-model-deployment", deployment as string);
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`);
  
      var raw = JSON.stringify({
        "question": form.get('question'),
        "chat_history": "[]",
      });
  
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
      };

      let data = await (await fetch("https://pollyfill-choaq.eastus2.inference.ml.azure.com/score", requestOptions)).json()
      return Response.json(data.answer)
    } catch(err) {
      console.log(err)
      return Response.json(err)
    }
  }