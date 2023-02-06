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
    static children(children?: ChildrenType[], classes?: string): {
        newClassNames: string;
        newChildren: any[];
    };
}

export { Post };