import { handleRoute, json, parseOptionalInteger, parseOptionalUuid } from "@/src/server/api/http";
import { getEventLeaderboard, resolveSetiEvent } from "@/src/server/seti/service";

export async function GET(request: Request) {
  return handleRoute(async () => {
    const { searchParams } = new URL(request.url);

    const event = await resolveSetiEvent({
      eventId: parseOptionalUuid(searchParams.get("eventId"), "eventId"),
      year: parseOptionalInteger(searchParams.get("year"), "year"),
    });

    const limit = parseOptionalInteger(searchParams.get("limit"), "limit");

    return json(await getEventLeaderboard(event, limit));
  });
}
