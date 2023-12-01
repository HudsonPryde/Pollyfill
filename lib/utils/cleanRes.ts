// clean the text response from the API into a JSON object
export default function cleanRes(res: string) {
    // remove whitespace and newlines
    res = res.replace(/\s/g, '')
    res = res.replace(/\n/g, '')
    return res
}