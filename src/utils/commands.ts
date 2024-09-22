const commands = {
    table: {
        content: `| Header 1 | Header 2 |\n| -------- | -------- |\n| Row 1    | Row 1   |\n| Row 2    | Row 2   |`,
        aliases: ['tb'],
    },
    list: {
        content: `- Item 1\n- Item 2\n- Item 3`,
        aliases: ['dashedlist', 'dlist'],
    },
    numberedlist: {
        content: `1. Item 1\n2. Item 2\n3. Item 3`,
        aliases: ['numlist', 'nlist'],
    },
    bulletlist: {
        content: `* Item 1\n* Item 2\n* Item 3`,
        aliases: ['blist'],
    },
    code: {
        content: '```\n// Your code here\n```',
        aliases: ['snippet'],
    },
    quote: {
        content: `> Your quoted text here`,
        aliases: ['blockquote'],
    },
    image: {
        content: `![Alt Text](URL)`,
        aliases: ['img', 'picture'],
    },
    link: {
        content: `[Link text](URL)`,
        aliases: ['url'],
    },
    tasklist: {
        content: `- [ ] Task 1\n- [X] Task 2`,
        aliases: ['tlist', 'todo'],
    },
    line: {
        content: `------`,
        aliases: ['horizontal', 'hr', 'separator', 'section'],
    },
    footnote: {
        content: `This is some text[^1].\n\n[^1]: Footnote text here.`,
        aliases: ['fn', 'reference'],
    },
    metadata: {
        content: `---\ntitle: Note Title\ndate: ${new Date().toLocaleString('default', { month: 'long' })} ${new Date().getDate()}, ${new Date().getFullYear()}\n---`,
        aliases: ['mdata', 'yaml']
    },
};

export default commands;