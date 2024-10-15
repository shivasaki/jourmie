import { WithUid } from "~/lib/firestore/firestore";
import { EventPoolItem } from "~/models/types/event_pool_item";

export type DBEventPoolItem = WithUid<EventPoolItem>;
