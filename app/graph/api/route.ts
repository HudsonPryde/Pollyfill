import type { NextApiRequest } from 'next'
 
export async function POST(req: Request) {
  try {
    const form = await req.formData()
    var myHeaders = new Headers();
    const deployment = form.get('deployment')
    myHeaders.append("azureml-model-deployment", "pollyfill-choaq-3");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`);

    var raw = JSON.stringify({
      "topic": form.get('topic'),
      "chat_history": JSON.parse(form.get('chat_history') as string),
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
    };

    let data = await (await fetch("https://pollyfill-choaq.eastus2.inference.ml.azure.com/score", requestOptions)).json()

    return Response.json(JSON.parse(data.subtopics))
  } catch(err) {
    console.log(err)
    return Response.json(err)
  }
}