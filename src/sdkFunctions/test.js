export class MemberTagPipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) {}
    transform(value: string, type = 'message', chatlist: boolean = false, searchListTrim: boolean = false, searchListKey: string = '') {
        if (!value) return;

        // searchList trim logic
        if (searchListTrim) {
            const condition1 = value
                .trim()
                .split(' ')
                .slice(0, 3)
                .some((str) => str.toLowerCase().includes(searchListKey.toLowerCase()));
            const lastFiveWordsList = value
                .trim()
                .split(' ')
                .slice(Math.max(value.trim().split(' ').length - 5, 0));
            const condition2 = lastFiveWordsList.some((str) => str.toLowerCase().includes(searchListKey.toLowerCase()));

            if (condition1) {
                const boldWordsList = value.split(' ').map((str) => {
                    if (str.trim().toLowerCase().includes(searchListKey.trim().toLowerCase())) {
                        if (str[0] === '<' && str[1] === '<') return str; // if its in a member tag just return the string
                        const index = str.toLowerCase().indexOf(searchListKey.toLowerCase());
                        let word = `${str.substring(0, index)}<b>${str.substring(index, index + searchListKey.length)}</b>${str.substring(
                            index + searchListKey.length
                        )}`;
                        return word;
                    }
                    return str;
                });

                value = boldWordsList.join(' ');
            } else if (condition2) {
                const boldlastFiveWordsList = lastFiveWordsList.map((str) => {
                    if (str.trim().toLowerCase().includes(searchListKey.trim().toLowerCase())) {
                        if (str[0] === '<' && str[1] === '<') return str; // if its in a member tag just return the string
                        const index = str.toLowerCase().indexOf(searchListKey.toLowerCase());
                        let word = `${str.substring(0, index)}<b>${str.substring(index, index + searchListKey.length)}</b>${str.substring(
                            index + searchListKey.length
                        )}`;
                        return word;
                    }
                    return str;
                });

                value = `...${boldlastFiveWordsList.join(' ')}`;
            } else {
                let matchedWordIdx;
                const boldWordsList = value
                    .trim()
                    .split(' ')
                    .map((str, i) => {
                        if (str.trim().toLowerCase().includes(searchListKey.trim().toLowerCase())) {
                            if (str[0] === '<' && str[1] === '<') return str; // if its in a member tag just return the string
                            matchedWordIdx = i;
                            const index = str.toLowerCase().indexOf(searchListKey.toLowerCase());
                            let word = `${str.substring(0, index)}<b>${str.substring(
                                index,
                                index + searchListKey.length
                            )}</b>${str.substring(index + searchListKey.length)}`;
                            return word;
                        }
                        return str;
                    });

                value = `...${boldWordsList.slice(matchedWordIdx - 3, matchedWordIdx).join(' ')} ${
                    boldWordsList[matchedWordIdx]
                } ${boldWordsList.slice(matchedWordIdx + 1).join(' ')}`;
            }
        }

        value = value.replace(/[\u{0080}-\u{FFFF}]/gu, ' ');

        let regEx1 = memberTagWithEmojiRegex || memberTagWithEmojiRegexProfile;
        if (value.search('member_profile') != -1) regEx1 = memberTagWithEmojiRegexProfile;
        else regEx1 = memberTagWithEmojiRegex;

        let memberTags: any[] = value.match(regEx1);
        if (memberTags) var tokens = value.split(new RegExp(memberTags.join('|'), 'g'));
        memberTags =
            memberTags &&
            memberTags.map((member) => ({
                matched: member,
                replaceWith: member.match(/[a-zA-Z0-9!@#\\'\" \$%\^\&\)\(+=._-]/g)[2],
            }));

        if (memberTags) {
            let counter = 0;
            value = value.replace(regEx1, '!tagged_member!').replace(/!tagged_member!/g, (_) => {
                const finalString = memberTags[counter].matched;
                counter++;
                return finalString;
            });
            memberTags.forEach((member) => {
                if (value.includes(member.matched)) {
                    if (type === 'message') {
                        value = value.replace(member.matched, `<b class="text-capitalize">${member.replaceWith}</b>`);
                    } else if (type === 'input') {
                        value = value.replace(
                            member.matched,
                            `<span contenteditable="false" class="tagged-span">${member.replaceWith}</span>`
                        );
                    } else if (type === 'copy') {
                        value = value.replace(member.matched, `${member.replaceWith}`);
                    }
                }
            });
        }

        value = chatlist
            ? value
            : anchorme({
                  input: value,
                  options: {
                      attributes: {
                          target: '_blank',
                      },
                  },
              });

        return value.replace('$#', ', ');
    }
}