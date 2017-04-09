using KeePassLib;
using KeePassLib.Collections;
using KeePassLib.Keys;
using KeePassLib.Serialization;
using KeePassWebUI.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Hosting;

namespace KeePassWebUI.DAL
{
    public class KeePassContext : IDisposable
    {
        private PwDatabase database;
        private bool databaseOpen;

        private KeePassContext()
        {
            databaseOpen = false;
        }

        public static KeePassContext Create()
        {
            return new KeePassContext();
        }

        private void Open()
        {
            if (databaseOpen)
                return;

            databaseOpen = true;

            string dbPath = ConfigurationManager.AppSettings["databasePath"];
            if (!File.Exists(dbPath))
                dbPath = HostingEnvironment.MapPath(dbPath);

            var ioConnInfo = new IOConnectionInfo { Path = dbPath };
            var compKey = new CompositeKey();

            if (!string.IsNullOrWhiteSpace(ConfigurationManager.AppSettings["databasePassword"]))
                compKey.AddUserKey(new KcpPassword(ConfigurationManager.AppSettings["databasePassword"]));

            string keyPath = ConfigurationManager.AppSettings["databaseKeyFile"];
            if (!string.IsNullOrWhiteSpace(keyPath))
            {
                if (!File.Exists(keyPath))
                    keyPath = HostingEnvironment.MapPath(keyPath);

                compKey.AddUserKey(new KcpKeyFile(keyPath));
            }

            database = new PwDatabase();
            database.Open(ioConnInfo, compKey, null);
        }

        public void Dispose()
        {
            if(database != null)
            {
                database.Close();
                database = null;
            }

            databaseOpen = false;
        }
        
        #region Groups
        private static List<PwGroup> groupCache;

        public List<KPGroup> Groups
        {
            get
            {
                if(groupCache == null)
                    groupCache = GetGroups();

                return groupCache
                    .Select(g => new KPGroup
                    {
                        ID = g.Uuid.ToHexString(),
                        ParentID = g.ParentGroup?.Uuid.ToHexString(),
                        Name = g.Name
                    })
                    .ToList();
            }
        }

        private List<PwGroup> GetGroups()
        {
            Open();

            PwObjectList<PwGroup> groups = database.RootGroup.GetGroups(true);
            if (groups == null)
                groups = new PwObjectList<PwGroup>();

            groups.Insert(0, database.RootGroup);

            return groups.CloneDeep().ToList();
        }
        #endregion

        #region Groups write actions
        public bool AddGroup(KPGroup group)
        {
            return false;
        }
        #endregion

        #region Entries
        private static List<PwEntry> entryCache;

        public List<KPEntry> Entries
        {
            get
            {
                if (entryCache == null)
                    entryCache = GetEntries();

                return entryCache
                    .Select(e => new KPEntry
                    {
                        ID = e.Uuid.ToHexString(),
                        GroupID = e.ParentGroup.Uuid.ToHexString(),
                        Name = e.Strings.GetSafe("Title").ReadString(),
                        Username = e.Strings.GetSafe("UserName").ReadString(),
                        Url = e.Strings.GetSafe("URL").ReadString(),
                        Password = e.Strings.GetSafe("Password").ReadString()
                    })
                    .ToList();
            }
        }

        private List<PwEntry> GetEntries()
        {
            Open();

            PwObjectList<PwEntry> entries = database.RootGroup.GetEntries(true);
            if (entries == null)
                entries = new PwObjectList<PwEntry>();

            return entries.CloneDeep().ToList();
        }
        #endregion

        #region Entry write actions
        public bool AddEntry(KPEntry entry)
        {
            Open();

            PwGroup group = null;
            if(database.RootGroup.Uuid.ToHexString().Equals(entry.GroupID, StringComparison.OrdinalIgnoreCase))
            {
                group = database.RootGroup;
            }
            else
            {
                group = database.RootGroup.GetGroups(true).FirstOrDefault(g => g.Uuid.ToHexString().Equals(entry.GroupID, StringComparison.OrdinalIgnoreCase));
            }

            if (group == null)
                return false;

            PwEntry newEntry = new PwEntry(true, true);
            newEntry.Strings.Set("Title", new KeePassLib.Security.ProtectedString(false, entry.Name));
            newEntry.Strings.Set("UserName", new KeePassLib.Security.ProtectedString(false, entry.Username));
            newEntry.Strings.Set("Password", new KeePassLib.Security.ProtectedString(true, entry.Password));
            newEntry.Strings.Set("URL", new KeePassLib.Security.ProtectedString(false, entry.Url));

            group.AddEntry(newEntry, false);
            database.Save(null);

            return true;
        }
        #endregion
    }
}