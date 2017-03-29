using KeePassLib;
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
        public List<Entry> GetEntries(string catalogId)
        {
            PwGroup parent = null;
            if (KeePassDatabase.Root.Uuid.ToHexString() == catalogId)
            {
                parent = KeePassDatabase.Root;
            }
            else
            {
                parent = KeePassDatabase
                    .Root
                    .GetFlatGroupList()
                    .FirstOrDefault(g => g.Uuid.ToHexString() == catalogId);
            }

            if (parent == null)
                return new List<Entry>();

            return parent
                .Entries
                .Select(e => new Entry
                {
                    ID = e.Uuid.ToHexString(),
                    Name = e.Strings.GetSafe("Title").ReadString(),
                    Username = e.Strings.GetSafe("UserName").ReadString(),
                    Url = e.Strings.GetSafe("URL").ReadString(),
                    Password = e.Strings.GetSafe("Password").ReadString()
                })
                .ToList();
        }
    }
}