import axios, { Axios, AxiosResponse } from 'axios';

const LIBRE_TRANSLATE_API = 'https://api.mymemory.translated.net/get';

export async function translateText(text: string, from: string, to: string): Promise<string> {
    console.log('util');
    try {
        const res: AxiosResponse<any> = await axios.get(LIBRE_TRANSLATE_API, {
            params: {
                q: text,
                langpair: `${from}|${to}`
            },
        })
        console.log(res.data.responseData.translatedText)
        return res.data.responseData.translatedText;
    }
    catch (err: Error | any) {
        console.log(err)
        return err.message;
    }
   
}
