// Get signalr.d.ts.ts from https://github.com/borisyankov/DefinitelyTyped (or delete the reference)
/// <reference path="signalr/signalr.d.ts" />
/// <reference path="jquery/jquery.d.ts" />

////////////////////
// available hubs //
////////////////////
//#region available hubs

interface SignalR {

    /**
      * The hub implemented by KeePassWebUI.Hubs.CatalogReaderHub
      */
    catalogReaderHub : CatalogReaderHub;

    /**
      * The hub implemented by KeePassWebUI.Hubs.EntryReaderHub
      */
    entryReaderHub : EntryReaderHub;
}
//#endregion available hubs

///////////////////////
// Service Contracts //
///////////////////////
//#region service contracts

//#region CatalogReaderHub hub

interface CatalogReaderHub {
    
    /**
      * This property lets you send messages to the CatalogReaderHub hub.
      */
    server : CatalogReaderHubServer;

    /**
      * The functions on this property should be replaced if you want to receive messages from the CatalogReaderHub hub.
      */
    client : any;
}

interface CatalogReaderHubServer {

    /** 
      * Sends a "getRootNode" message to the CatalogReaderHub hub.
      * Contract Documentation: ---
      * @return {JQueryPromise of Catalog}
      */
    getRootNode() : JQueryPromise<Catalog>

    /** 
      * Sends a "getChildren" message to the CatalogReaderHub hub.
      * Contract Documentation: ---
      * @param catalogId {string} 
      * @return {JQueryPromise of IEnumerableOfCatalog}
      */
    getChildren(catalogId : string) : JQueryPromise<IEnumerableOfCatalog>
}

//#endregion CatalogReaderHub hub


//#region EntryReaderHub hub

interface EntryReaderHub {
    
    /**
      * This property lets you send messages to the EntryReaderHub hub.
      */
    server : EntryReaderHubServer;

    /**
      * The functions on this property should be replaced if you want to receive messages from the EntryReaderHub hub.
      */
    client : any;
}

interface EntryReaderHubServer {

    /** 
      * Sends a "getEntries" message to the EntryReaderHub hub.
      * Contract Documentation: ---
      * @param catalogId {string} 
      * @return {JQueryPromise of Entry[]}
      */
    getEntries(catalogId : string) : JQueryPromise<Entry[]>
}

//#endregion EntryReaderHub hub

//#endregion service contracts



////////////////////
// Data Contracts //
////////////////////
//#region data contracts


/**
  * Data contract for KeePassWebUI.Models.Entry
  */
interface Entry {
	ID : string;
	Name : string;
	Username : string;
	Url : string;
	Password : string;
}


/**
  * Data contract for System.Collections.Generic.IEnumerable`1[[KeePassWebUI.Models.Catalog, KeePassWebUI, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null]]
  */
interface IEnumerableOfCatalog {
}


/**
  * Data contract for KeePassWebUI.Models.Catalog
  */
interface Catalog {
	ID : string;
	Name : string;
}

//#endregion data contracts

