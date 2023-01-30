type ChildrenType = {
    type: string;
    props: {
        children?: ChildrenType | ChildrenType[];
        className?: string;
        id?: string;
    };
};
declare class Post {
    private static getMapOfClasses;
    private static applyMappedClasses;
    private static isTheSameType;
    static children(children?: ChildrenType | ChildrenType[], classes?: string): {
        newClassNames: string;
        newChildren: ChildrenType[] | undefined;
    };
}

export { Post };
