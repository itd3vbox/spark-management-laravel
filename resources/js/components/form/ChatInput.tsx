import React from "react"
import { ArrowUpIcon } from '@heroicons/react/24/outline'

interface ChatInputProps {
    onSend?: (content: string) => void
}

export default class ChatInput extends React.Component<ChatInputProps> {
    private editorRef = React.createRef<HTMLDivElement>()

    componentDidMount() {
        this.ensureParagraph()
    }

    // Always ensure an empty <p> at the start
    ensureParagraph() {
        const el = this.editorRef.current
        if (!el) return

        if (el.innerHTML.trim() === '') {
            el.innerHTML = `<p class="editor-line is-empty" data-placeholder="Write a message..."></p>`
        }
    }

    // Get plain text with \n between <p> tags
    getPlainText(): string {
        const el = this.editorRef.current
        if (!el) return ''

        const lines = Array.from(el.querySelectorAll('p'))
            .map(p => p.innerText.replace(/\u00A0/g, ' ').trimEnd())

        return lines.join('\n').trim()
    }

    // Send the message
    handleSend = () => {
        const text = this.getPlainText()
        if (!text) return

        this.props.onSend?.(text)

        const el = this.editorRef.current
        if (!el) return

        el.innerHTML = ''

        const p = document.createElement('p')
        p.className = 'editor-line is-empty'
        p.setAttribute('data-placeholder', 'Write a message...')
        el.appendChild(p)

        // Move cursor to the end of the <p>
        const range = document.createRange()
        range.selectNodeContents(p)
        range.collapse(false)  // <- this is the fix
        const sel = window.getSelection()
        if (sel) {
            sel.removeAllRanges()
            sel.addRange(range)
        }
    }

    // Handle placeholder
    handleInput = () => 
    {
        const el = this.editorRef.current;
        if (!el) return;

        const p = el.querySelector('p');
        if (p) {
            const isEmpty = p.innerText.trim() === '';
            p.classList.toggle('is-empty', isEmpty);
        }

        // ⚡ Very important: restore <p> if everything is cleared
        this.resetLine();
    }

    // Find the closest parent <p>
    getClosestP(node: Node): HTMLParagraphElement | null {
        while (node && node !== this.editorRef.current) {
            if (node.nodeName === 'P') return node as HTMLParagraphElement
            node = node.parentNode as Node
        }
        return null
    }

    resetLine() {
        const el = this.editorRef.current;
        if (!el) return;

        const p = el.querySelector('p');

        if (!p || el.innerHTML.trim() === '') {
            const newP = document.createElement('p');
            newP.className = 'editor-line is-empty';
            newP.setAttribute('data-placeholder', 'Write a message...');
            newP.innerHTML = '<br>'; // so the cursor is visible
            el.innerHTML = ''; // clear everything
            el.appendChild(newP);

            // place cursor at the start of <p>
            const range = document.createRange();
            range.setStart(newP, 0);
            range.collapse(true);
            const sel = window.getSelection();
            if (sel) {
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
    }

    // Keyboard handling
    handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter') {
            const sel = window.getSelection()
            if (!sel || !sel.rangeCount) return

            const range = sel.getRangeAt(0)

            if (e.shiftKey) {
                e.preventDefault()

                const p = this.getClosestP(range.startContainer)
                if (!p) return

                // Create a new empty <p> after the current <p>
                const newP = document.createElement('p')
                newP.className = 'editor-line is-empty'
                newP.setAttribute('data-placeholder', '')

                // Insert after the current <p>
                p.parentNode?.insertBefore(newP, p.nextSibling)

                // Place cursor at the end of the new <p>
                const newRange = document.createRange()
                newRange.selectNodeContents(newP)
                newRange.collapse(true)
                sel.removeAllRanges()
                sel.addRange(newRange)

            } else {
                // Enter alone → send the message
                e.preventDefault()
                this.handleSend()
            }
        }
    }

    render() {
        return (
            <div className="form-chat-input">
                <div
                    ref={this.editorRef}
                    className="chat-input"
                    contentEditable
                    suppressContentEditableWarning
                    onInput={this.handleInput}
                    onKeyDown={this.handleKeyDown}
                    aria-label="Chat message input"
                />

                <div className="chat-options">
                    <div className="o-left"></div>

                    <div className="o-right">
                        <button
                            type="button"
                            className="button-icon o-send"
                            onClick={this.handleSend}
                        >
                            <ArrowUpIcon />
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}