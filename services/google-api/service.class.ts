import GoogleResponse from "@/services/google-api/interfaces";

export default class Service {
  public static async searchVideos(query: string): Promise<GoogleResponse> {
    return (await (
      await fetch(
        `https://yt.lemnoslife.com/noKey/search?part=snippet&maxResults=25&regionCode=es&type=video&videoEmbeddable=true&q=${query}`
      )
    ).json()) as GoogleResponse;
  }
}
