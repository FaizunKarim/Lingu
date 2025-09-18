import Replicate from 'replicate'
import dotenv from 'dotenv'
dotenv.config()

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
  userAgent: 'https://www.npmjs.com/package/create-replicate'
})
const model = 'ibm-granite/granite-3.3-8b-instruct:601ff87e6afa76bd7bdbf8292ea250d70b0ad2ddedc17c236e7fa3fe38a374a8'
const input = {
  top_k: 50,
  top_p: 0.9,
  prompt: 'How is perplexity measured for LLMs and why is it useful?',
  max_tokens: 512,
  min_tokens: 0,
  temperature: 0.6,
  presence_penalty: 0,
  frequency_penalty: 0,
}

console.log('Using model: %s', model)
console.log('With input: %O', input)

console.log('Running...')
const output = await replicate.run(model, { input })
console.log('Done!', output)
