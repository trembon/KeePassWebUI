using KeePassLib;
using KeePassWebUI.DAL;
using KeePassWebUI.Models;
using Microsoft.AspNet.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace KeePassWebUI.Hubs
{
    public interface IEntryHubClient
    {
        void EntryAdded(KPEntry entry);
    }

    public class EntryHub : Hub<IEntryHubClient>
    {
        public List<KPEntry> GetEntries(string groupId)
        {
            using (var context = KeePassContext.Create())
            {
                return context
                    .Entries
                    .Where(e => e.GroupID == groupId)
                    .ToList();
            }
        }

        public bool AddEntry(KPEntry entry)
        {
            using(var context = KeePassContext.Create())
            {
                bool result = context.AddEntry(entry);

                if (result)
                    Clients.All.EntryAdded(entry);

                return result;
            }
        }
    }
}