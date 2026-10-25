import type { ServerProps } from "payload";

const typeLabel: Record<string, string> = {
  contact: "Contact us",
  "work-with-us": "Work with us",
  "join-database": "Join the database",
};

export async function InboxOverview({ payload, user }: ServerProps) {
  if (!user) return null;

  try {
    const result = await payload.find({
      collection: "submissions",
      limit: 8,
      depth: 0,
      sort: "-createdAt",
    });

    return (
      <section className="sife-inbox">
        <div className="sife-inbox__header">
          <p className="sife-inbox__kicker">Inbox</p>
          <h2 className="sife-inbox__title">Contact messages</h2>
          <p className="sife-inbox__lede">About → Contact us, Work with us, and Join the database all land here.</p>
        </div>
        {result.docs.length === 0 ? (
          <p className="sife-inbox__empty">No messages yet. New Contact us submissions will show up in this list.</p>
        ) : (
          <ul className="sife-inbox__list">
            {result.docs.map((doc) => (
              <li key={String(doc.id)}>
                <a className="sife-inbox__row" href={`/admin/collections/submissions/${doc.id}`}>
                  <span className="sife-inbox__type">{typeLabel[String(doc.type)] || String(doc.type)}</span>
                  <span className="sife-inbox__name">{doc.name}</span>
                  <span className="sife-inbox__email">{doc.email}</span>
                  <span className="sife-inbox__status">{doc.status}</span>
                </a>
              </li>
            ))}
          </ul>
        )}
        <a className="sife-inbox__all" href="/admin/collections/submissions">
          Open all messages
        </a>
      </section>
    );
  } catch {
    return null;
  }
}
