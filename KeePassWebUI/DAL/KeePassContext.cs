using KeePassLib;
using KeePassLib.Collections;
using KeePassLib.Keys;
using KeePassLib.Serialization;
using KeePassWebUI.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Drawing;
using System.Linq;
using System.Web;

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

            var ioConnInfo = new IOConnectionInfo { Path = ConfigurationManager.AppSettings["databasePath"] };
            var compKey = new CompositeKey();

            if (!string.IsNullOrWhiteSpace(ConfigurationManager.AppSettings["databasePassword"]))
                compKey.AddUserKey(new KcpPassword(ConfigurationManager.AppSettings["databasePassword"]));

            if (!string.IsNullOrWhiteSpace(ConfigurationManager.AppSettings["databaseKeyFile"]))
                compKey.AddUserKey(new KcpKeyFile(ConfigurationManager.AppSettings["databaseKeyFile"]));

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
    }
}