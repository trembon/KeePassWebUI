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
    public class EntryReaderHub : Hub
    {
        public List<KPEntry> GetEntries(string groupId)
        {
            using (var context = KeePassContext.Create())
            {
                return context
                    .Enties
                    .Where(e => e.GroupID == groupId)
                    .ToList();
            }
        }
    }
}