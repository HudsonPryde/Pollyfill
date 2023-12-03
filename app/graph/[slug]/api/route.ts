import type { NextApiRequest } from 'next'
import cleanRes from '@/lib/utils/cleanRes';
 
export async function POST(req: Request, { params }: { params: { slug: string } }) {
  try {
    var myHeaders = new Headers();
    myHeaders.append("azureml-model-deployment", "pollyfill-choaq-3");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`);

    var raw = JSON.stringify({
      "topic": params.slug,
      "chat_history": []
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
    };
    const res = await (await fetch("https://pollyfill-choaq.eastus2.inference.ml.azure.com/score", requestOptions)).json()
    console.log(res)
    let data = res.subtopics
    data = data.replace(/'/g, '"')
    return Response.json(JSON.parse(data))
  } catch(err) {
    console.log(err)
    return Response.json(err)
  }
}