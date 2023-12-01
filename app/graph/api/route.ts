import type { NextApiRequest } from 'next'
import cleanRes from '@/lib/utils/cleanRes';
 
export async function POST(req: NextApiRequest) {
  try {
    var myHeaders = new Headers();
    myHeaders.append("azureml-model-deployment", "pollyfill-wzlvy-1");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`);

    var raw = JSON.stringify({
      "topic": req.body.topic,
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
    };

    const res = await (await fetch("https://pollyfill-wzlvy.eastus2.inference.ml.azure.com/score", requestOptions)).text()
    const subtopics = cleanRes(res)
    return Response.json(subtopics)
  } catch(err) {
    console.log(err)
    return Response.json(err)
  }
}