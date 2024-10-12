"use client";
import { useEffect, useState } from "react";
import { collection, doc } from "firebase/firestore";
import { Pen, Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import { EventInputDialog } from "~/features/eventPool/EventInputDialog";
import { EventPoolList } from "~/features/eventPool/EventPoolList";
import useCurrentAccount from "~/hooks/useCurrentAccount";
import { useFirestoreCollection } from "~/hooks/useFirestoreCollection";
import { db } from "~/lib/firebase";
import { EventPool } from "~/models/types/event_pool";
import { ViewTitle } from "~/components/common/ViewTitle";
import SmallTitleWithIcon from "~/components/common/SmallTitleWithIcon";
import { Blocks } from "lucide-react";
import BackButton from "~/components/common/BackButton";
import { useRouter } from "next/navigation";

export default function CalendarEditSidebar({
  events,
  setEvents,
}: {
  events: EventPool[];
  setEvents: React.Dispatch<React.SetStateAction<EventPool[]>>;
}) {
  const { currentDBAccount } = useCurrentAccount();
  const { list: listEventPool } = useFirestoreCollection<EventPool>(
    currentDBAccount !== "loading" && currentDBAccount?.uid
      ? collection(doc(db, "accounts", currentDBAccount.uid), "event_pool")
      : null
  );
  const [openDialog, setOpenDialog] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (listEventPool) {
      listEventPool().then((events) => {
        if (events) {
          console.log(events);
          setEvents(events);
        } else {
          console.log("No events found");
        }
      });
    }
  }, [listEventPool]);

  if (currentDBAccount === "loading") {
    return <div>Loading...</div>;
  } else if (!currentDBAccount) {
    return <div>Not logged in</div>;
  }

  return (
    <div className="p-6 flex flex-col gap-4 h-svh border-r border-brand-border-color w-[402px]">
      <div>
        <BackButton onClick={() => router.forward()} />
      </div>
      <div>
        <ViewTitle title="予定を編集" subTitle="あなたのカレンダー"></ViewTitle>
      </div>
      <div className="flex justify-between">
        <SmallTitleWithIcon
          icon={<Blocks />}
          title="イベント候補"
        ></SmallTitleWithIcon>
        <Button
          onClick={() => setOpenDialog(true)}
          className="flex items-center gap-1 pr-4 h-8"
          size={"sm"}
        >
          <Plus strokeWidth={"1.5px"} size={20} />
          作成
        </Button>
      </div>
      <EventPoolList events={events} />
      <EventInputDialog isOpen={openDialog} onOpenChange={setOpenDialog} />
    </div>
  );
}
