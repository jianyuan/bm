/**
 * This file was @generated using typed-pocketbase
 */

// https://pocketbase.io/docs/collections/#base-collection
export interface BaseCollectionResponse {
	/**
	 * 15 characters string to store as record ID.
	 */
	id: string;
	/**
	 * Date string representation for the creation date.
	 */
	created: string;
	/**
	 * Date string representation for the creation date.
	 */
	updated: string;
	/**
	 * The collection id.
	 */
	collectionId: string;
	/**
	 * The collection name.
	 */
	collectionName: string;
}

// https://pocketbase.io/docs/api-records/#create-record
export interface BaseCollectionCreate {
	/**
	 * 15 characters string to store as record ID.
	 * If not set, it will be auto generated.
	 */
	id?: string;
}

// https://pocketbase.io/docs/api-records/#update-record
export interface BaseCollectionUpdate {}

// https://pocketbase.io/docs/collections/#auth-collection
export interface AuthCollectionResponse extends BaseCollectionResponse {
	/**
	 * The username of the auth record.
	 */
	username: string;
	/**
	 * Auth record email address.
	 */
	email: string;
	/**
	 * Whether to show/hide the auth record email when fetching the record data.
	 */
	emailVisibility: boolean;
	/**
	 * Indicates whether the auth record is verified or not.
	 */
	verified: boolean;
}

// https://pocketbase.io/docs/api-records/#create-record
export interface AuthCollectionCreate extends BaseCollectionCreate {
	/**
	 * The username of the auth record.
	 * If not set, it will be auto generated.
	 */
	username?: string;
	/**
	 * Auth record email address.
	 */
	email?: string;
	/**
	 * Whether to show/hide the auth record email when fetching the record data.
	 */
	emailVisibility?: boolean;
	/**
	 * Auth record password.
	 */
	password: string;
	/**
	 * Auth record password confirmation.
	 */
	passwordConfirm: string;
	/**
	 * Indicates whether the auth record is verified or not.
	 * This field can be set only by admins or auth records with "Manage" access.
	 */
	verified?: boolean;
}

// https://pocketbase.io/docs/api-records/#update-record
export interface AuthCollectionUpdate {
	/**
	 * The username of the auth record.
	 */
	username?: string;
	/**
	 * The auth record email address.
	 * This field can be updated only by admins or auth records with "Manage" access.
	 * Regular accounts can update their email by calling "Request email change".
	 */
	email?: string;
	/**
	 * Whether to show/hide the auth record email when fetching the record data.
	 */
	emailVisibility?: boolean;
	/**
	 * Old auth record password.
	 * This field is required only when changing the record password. Admins and auth records with "Manage" access can skip this field.
	 */
	oldPassword?: string;
	/**
	 * New auth record password.
	 */
	password?: string;
	/**
	 * New auth record password confirmation.
	 */
	passwordConfirm?: string;
	/**
	 * Indicates whether the auth record is verified or not.
	 * This field can be set only by admins or auth records with "Manage" access.
	 */
	verified?: boolean;
}

// https://pocketbase.io/docs/collections/#view-collection
export interface ViewCollectionRecord {
	id: string;
}

// utilities

type MaybeArray<T> = T | T[];

// ===== users =====

export interface UsersResponse extends AuthCollectionResponse {
	collectionName: 'users';
	name: string;
	avatar: string;
}

export interface UsersCreate extends AuthCollectionCreate {
	name?: string;
	avatar?: File | null;
}

export interface UsersUpdate extends AuthCollectionUpdate {
	name?: string;
	avatar?: File | null;
}

export interface UsersCollection {
	type: 'auth';
	collectionId: string;
	collectionName: 'users';
	response: UsersResponse;
	create: UsersCreate;
	update: UsersUpdate;
	relations: {
		'bookmarks(user)': BookmarksCollection[];
		'screenshots(user)': ScreenshotsCollection[];
		'tags(user)': TagsCollection[];
	};
}

// ===== bookmarks =====

export interface BookmarksResponse extends BaseCollectionResponse {
	collectionName: 'bookmarks';
	user: string;
	url: string;
	title: string;
	description: string;
	favicon: string;
	screenshot: string;
	tags: Array<string>;
}

export interface BookmarksCreate extends BaseCollectionCreate {
	user: string;
	url?: string | URL;
	title?: string;
	description?: string;
	favicon?: File | null;
	screenshot?: string;
	tags?: MaybeArray<string>;
}

export interface BookmarksUpdate extends BaseCollectionUpdate {
	user?: string;
	url?: string | URL;
	title?: string;
	description?: string;
	favicon?: File | null;
	screenshot?: string;
	tags?: MaybeArray<string>;
	'tags+'?: MaybeArray<string>;
	'tags-'?: MaybeArray<string>;
}

export interface BookmarksCollection {
	type: 'base';
	collectionId: string;
	collectionName: 'bookmarks';
	response: BookmarksResponse;
	create: BookmarksCreate;
	update: BookmarksUpdate;
	relations: {
		user: UsersCollection;
		screenshot: ScreenshotsCollection;
		tags: TagsCollection[];
	};
}

// ===== screenshots =====

export interface ScreenshotsResponse extends BaseCollectionResponse {
	collectionName: 'screenshots';
	user: string;
	file: string;
	url: string;
}

export interface ScreenshotsCreate extends BaseCollectionCreate {
	user: string;
	file: File | null;
	url: string | URL;
}

export interface ScreenshotsUpdate extends BaseCollectionUpdate {
	user?: string;
	file?: File | null;
	url?: string | URL;
}

export interface ScreenshotsCollection {
	type: 'base';
	collectionId: string;
	collectionName: 'screenshots';
	response: ScreenshotsResponse;
	create: ScreenshotsCreate;
	update: ScreenshotsUpdate;
	relations: {
		'bookmarks(screenshot)': BookmarksCollection[];
		user: UsersCollection;
	};
}

// ===== tags =====

export interface TagsResponse extends BaseCollectionResponse {
	collectionName: 'tags';
	user: string;
	name: string;
}

export interface TagsCreate extends BaseCollectionCreate {
	user: string;
	name?: string;
}

export interface TagsUpdate extends BaseCollectionUpdate {
	user?: string;
	name?: string;
}

export interface TagsCollection {
	type: 'base';
	collectionId: string;
	collectionName: 'tags';
	response: TagsResponse;
	create: TagsCreate;
	update: TagsUpdate;
	relations: {
		'bookmarks(tags)': BookmarksCollection[];
		user: UsersCollection;
	};
}

// ===== Schema =====

export type Schema = {
	users: UsersCollection;
	bookmarks: BookmarksCollection;
	screenshots: ScreenshotsCollection;
	tags: TagsCollection;
};
