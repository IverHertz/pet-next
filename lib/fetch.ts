const BaseUrl = '/api';

export class Fetch {
    static post(url: string, data: any) {
        return fetch(BaseUrl + url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
    }
}