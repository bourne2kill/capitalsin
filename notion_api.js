// Capital Sin - Notion API Integration

function sendToNotion(token, dbOrPg, markdown, cb) {
  // dbOrPg: either database_id, page_id, or blank
  const url = "https://api.notion.com/v1/pages";
  
  // Determine parent type
  let parent = {};
  if (dbOrPg) {
    // Check if it looks like a database ID or page ID
    if (dbOrPg.length === 32 || dbOrPg.includes('-')) {
      parent = {database_id: dbOrPg};
    } else {
      parent = {page_id: dbOrPg};
    }
  } else {
    // Default to workspace (may not work with all tokens, database_id recommended)
    parent = {workspace: true};
  }
  
  // Build Notion page payload
  const payload = {
    parent: parent,
    properties: {
      title: {
        title: [
          {
            text: {
              content: "TogetherChat Export - " + new Date().toLocaleString()
            }
          }
        ]
      }
    },
    children: [
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [
            {
              type: "text",
              text: {
                content: markdown
              }
            }
          ]
        }
      }
    ]
  };
  
  fetch(url, {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + token,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })
  .then(res => res.json())
  .then(d => {
    if (d.object === "error") {
      cb(false, d.message || "API Error");
    } else if (d.id) {
      cb(true, d.id);
    } else {
      cb(false, "Unknown response: " + JSON.stringify(d));
    }
  })
  .catch(e => cb(false, e.message));
}
