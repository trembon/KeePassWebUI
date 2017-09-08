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
        void entryAdded(KPEntry entry);
    }

    public class EntryHub : Hub<IEntryHubClient>
    {
        public List<KPEntry> GetEntries(string groupId)
        {
            return KeePassContext
                .Instance
                .Entries
                .Where(e => e.GroupID == groupId)
                .ToList();
        }

        public bool AddEntry(KPEntry entry)
        {
            bool result = KeePassContext.Instance.AddEntry(entry);

            if (result)
                Clients.All.entryAdded(entry);

            return result;
        }
    }
}