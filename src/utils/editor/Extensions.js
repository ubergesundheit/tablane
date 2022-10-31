import { Extension } from '@tiptap/react'

const DisableEnter = Extension.create({
    addKeyboardShortcuts() {
        return {
            Enter: () => {
                if (['comment', 'comment-edit'].includes(this.options.type)) {
                    if (!this.editor.isEmpty) {
                        this.options.saveComment(this.editor.getJSON())
                        this.editor.commands.clearContent()
                    }
                    return true
                }
            }
        }
    }
})

export default DisableEnter
