/**
 * Interface for messages between the background and the content script
 */
export interface IMessage {
    /** The action that this message is performing */
    action: MessageActions,
    /** The Artist is being looking for */
    artist: string,
    /** The Album or Release that is being looked for */
    album: string
}

/**
 * String-Type for the types of messages passing between the content
 * and background script.
 */
export type MessageActions = 'search-tidal';