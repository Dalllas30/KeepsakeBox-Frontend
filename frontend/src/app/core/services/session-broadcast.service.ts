import { Injectable, OnDestroy } from '@angular/core';

export type PwdMessageType = 'IMAGE_UPDATE' | 'SESSION_END';

export interface PwdScreenMessage {
  type: PwdMessageType;
  imageURL?: string;
}

/**
 * Wraps the BroadcastChannel API so that the caregiver's running-session
 * tab can push the current image URL to the PwD view tab in real time.
 *
 * Both tabs must be on the same origin (same device, same browser).
 * Channel name: 'keepsakebox-pwd-screen'
 */
@Injectable({ providedIn: 'root' })
export class SessionBroadcastService implements OnDestroy {

  private readonly CHANNEL_NAME = 'keepsakebox-pwd-screen';
  private channel: BroadcastChannel;

  constructor() {
    this.channel = new BroadcastChannel(this.CHANNEL_NAME);
  }

  /** Sends the current image URL to the PwD screen. */
  broadcastImage(imageURL: string): void {
    this.channel.postMessage({ type: 'IMAGE_UPDATE', imageURL } as PwdScreenMessage);
  }

  /** Signals the PwD screen that the session has ended. */
  broadcastSessionEnd(): void {
    this.channel.postMessage({ type: 'SESSION_END' } as PwdScreenMessage);
  }

  /**
   * Subscribes to incoming messages from the caregiver tab.
   * Returns an unsubscribe function — call it in ngOnDestroy.
   */
  onMessage(handler: (msg: PwdScreenMessage) => void): () => void {
    const listener = (event: MessageEvent<PwdScreenMessage>) => handler(event.data);
    this.channel.addEventListener('message', listener);
    return () => this.channel.removeEventListener('message', listener);
  }

  ngOnDestroy(): void {
    this.channel.close();
  }
}