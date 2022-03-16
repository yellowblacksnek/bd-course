package com.example.bd_back.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class MvcController {
    @RequestMapping("/")
    public String get(){
        return "index";
    }
}
